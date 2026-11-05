
pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "inventrack"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out InvenTrack repository...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                bat 'npm ci'
            }
        }

        stage('Build Application') {
            steps {
                echo 'Building NestJS application...'
                bat 'npm run build'
            }
        }

        stage('Validate Docker Compose') {
            steps {
                echo 'Validating Docker Compose configuration...'
                bat 'docker compose config -q'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building InvenTrack API image...'
                bat 'docker compose build api'
            }
        }

        stage('Deploy Application') {
            steps {
                echo 'Starting InvenTrack API and Redis...'
                bat 'docker compose up -d'
            }
        }

        stage('Verify Containers') {
            steps {
                echo 'Checking running containers...'
                bat 'docker compose ps'
            }
        }
    }

    post {
        success {
            echo 'InvenTrack deployed successfully!'
        }

        failure {
            echo 'InvenTrack pipeline failed!'
        }
    }
}
