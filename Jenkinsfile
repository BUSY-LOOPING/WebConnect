pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                cleanWs()
                checkout scm  
            }
        }
        stage('Build & Start Docker Compose') {
            steps {
                withCredentials([file(credentialsId: 'webconnect-env', variable: 'SECURE_ENV')]) {
                    script {
                        sh "cp \$SECURE_ENV .env"
                        sh "sed -i 's/\r//' .env"
                        sh 'docker compose down --remove-orphans || true'
                        sh 'docker compose build'
                        sh 'docker compose up -d'
                        sleep 5
                    }
                }
            }
        }
        stage('Verify') {
            steps {
                echo 'Docker Compose started successfully!'
                sh 'docker ps'
            }
        }
    }
    post {
        failure {
            echo 'Pipeline failed!'
        }
    }
}