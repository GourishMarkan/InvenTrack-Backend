import {  ConflictException,
  Injectable,
  NotFoundException, } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {

  constructor(private readonly prisma:PrismaService){}
  async create(createOrderDto: CreateOrderDto,userId:number) {
   const { orderItems, discount = 0, tax = 0, paymentType } =
      createOrderDto;

    const quantities = new Map<number, number>();

    for (const item of orderItems) {
      quantities.set(
        item.productId,
        (quantities.get(item.productId) ?? 0) + item.quantity,
      );
    }

    return this.prisma.$transaction(
      async (tx) => {
        const products = await tx.product.findMany({
          where: {
            id: { in: [...quantities.keys()] },
            isDeleted: false,
          },
        });

        if (products.length !== quantities.size) {
          const foundIds = new Set(products.map((product) => product.id));
          const missingProductIds = [...quantities.keys()].filter(
            (productId) => !foundIds.has(productId),
          );

          throw new NotFoundException(
            `Product(s) not found: ${missingProductIds.join(', ')}`,
          );
        }

        const productsById = new Map(
          products.map((product) => [product.id, product]),
        );

        let subtotal = 0;

        for (const [productId, quantity] of quantities) {
          const product = productsById.get(productId);

          if (!product) {
            throw new NotFoundException(`Product ${productId} not found`);
          }

          // This conditional update is atomic and prevents overselling
          // when concurrent orders target the same product.
          const updated = await tx.product.updateMany({
            where: {
              id: productId,
              isDeleted: false,
              stock: { gte: quantity },
            },
            data: {
              stock: { decrement: quantity },
            },
          });

          if (updated.count !== 1) {
            throw new ConflictException(
              `Insufficient stock for product "${product.name}"`,
            );
          }

          subtotal += product.sellingPrice * quantity;
        }

        const total = subtotal - discount + tax;

        if (total < 0) {
          throw new ConflictException(
            'Discount cannot be greater than the order subtotal plus tax',
          );
        }

        const order = await tx.order.create({
          data: {
            createdBy: userId,
            discount,
            tax,
            total,
            ...(paymentType ? { paymentType } : {}),
          },
        });

        const createdItems = await Promise.all(
          [...quantities.entries()].map(([productId, quantity]) => {
            const product = productsById.get(productId)!;

            return tx.orderItem.create({
              data: {
                orderId: order.id,
                productId,
                quantity,
                sellingPrice: product.sellingPrice,
                costPrice: product.costPrice,
              },
            });
          }),
        );

        await tx.stockMovement.createMany({
          data: createdItems.map((item) => ({
            productId: item.productId,
            orderItemId: item.id,
            quantity: item.quantity,
            type: 'Sale',
            createdById: userId,
          })),
        });

        return tx.order.findUniqueOrThrow({
          where: { id: order.id },
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        });
      },
      {
        maxWait: 5000,
        timeout: 15000,
      },
    );
    
  }

 async  findAll() {
  
  return this.prisma.order.findMany({
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });
}
  

  async findOne(id: number) {
    return  await this.prisma.order.findUnique({
      where:{
        id
      }
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async remove(id: number) {
    return await this.prisma.order.delete({
      where:{
        id
      }
    });
  }
}
