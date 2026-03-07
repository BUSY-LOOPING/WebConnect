pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git(
                    url: 'https://github.com/BUSY-LOOPING/WebConnect.git',
                    branch: 'main'
                )
            }
        }

        stage('Build & Start Docker Compose') {
            steps {
                withCredentials([file(credentialsId: 'webconnect-env', variable: 'SECURE_ENV')]) {
                    script {
                        sh "cp \$SECURE_ENV .env"
                        sh 'docker compose up --build -d'
                        
                        echo 'Waiting for 5 seconds...'
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