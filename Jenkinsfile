pipeline {
    agent { docker { image 'docker:24-dind' } }

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
                script {
                    sh 'docker --version'
                    sh 'docker-compose --version'

                    sh 'docker-compose up --build -d'

                    echo 'Waiting for 5 seconds for containers to settle...'
                    sleep 5
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