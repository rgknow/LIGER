pipeline {
    agent {
        label 'docker-agent'
    }
    
    environment {
        DOCKER_REGISTRY = 'docker.io/liger'
        KUBECONFIG = credentials('kubeconfig')
        DATABASE_URL = credentials('database-url')
        REDIS_URL = credentials('redis-url')
        JWT_SECRET = credentials('jwt-secret')
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 1, unit: 'HOURS')
        timestamps()
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    sh '''
                        node --version
                        npm --version
                        npm ci
                    '''
                }
            }
        }
        
        stage('Lint & Test') {
            parallel {
                stage('Lint') {
                    steps {
                        sh 'npm run lint'
                    }
                }
                stage('Unit Tests') {
                    steps {
                        sh 'npm run test'
                    }
                    post {
                        always {
                            publishTestResults testResultsPattern: 'coverage/junit.xml'
                            publishCoverage adapters: [
                                istanbulCoberturaAdapter('coverage/cobertura-coverage.xml')
                            ], sourceFileResolver: sourceFiles('STORE_LAST_BUILD')
                        }
                    }
                }
            }
        }
        
        stage('Build Services') {
            parallel {
                stage('Build Core Services') {
                    steps {
                        script {
                            def coreServices = [
                                'proposal-svc',
                                'approval-svc',
                                'token-bank-svc',
                                'scoring-svc'
                            ]
                            coreServices.each { service ->
                                sh "npm run build --workspace=apps/${service}"
                            }
                        }
                    }
                }
                stage('Build Gift Module') {
                    steps {
                        script {
                            def giftServices = [
                                'gift-svc',
                                'pay-svc',
                                'profile-svc',
                                'qr-svc'
                            ]
                            giftServices.each { service ->
                                sh "npm run build --workspace=apps/${service}"
                            }
                        }
                    }
                }
                stage('Build Loan Module') {
                    steps {
                        script {
                            def loanServices = [
                                'scholarship-svc',
                                'loan-svc',
                                'dossier-svc',
                                'escrow-svc'
                            ]
                            loanServices.each { service ->
                                sh "npm run build --workspace=apps/${service}"
                            }
                        }
                    }
                }
            }
        }
        
        stage('Database Migration') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                sh '''
                    cd packages/prisma
                    npx prisma generate
                    npx prisma migrate deploy
                '''
            }
        }
        
        stage('Docker Build & Push') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                script {
                    def services = [
                        'proposal-svc', 'approval-svc', 'risk-svc', 'notify-svc',
                        'gift-svc', 'pay-svc', 'profile-svc', 'qr-svc',
                        'scholarship-svc', 'loan-svc', 'dossier-svc', 'escrow-svc',
                        'assessment-svc', 'scoring-svc', 'habits-svc', 'reporting-svc'
                    ]
                    
                    services.each { service ->
                        def imageTag = "${DOCKER_REGISTRY}/${service}:${BUILD_NUMBER}"
                        def latestTag = "${DOCKER_REGISTRY}/${service}:latest"
                        
                        sh """
                            docker build -t ${imageTag} -t ${latestTag} -f apps/${service}/Dockerfile .
                            docker push ${imageTag}
                            docker push ${latestTag}
                        """
                    }
                }
            }
        }
        
        stage('Security Scan') {
            parallel {
                stage('Dependency Check') {
                    steps {
                        sh 'npm audit --audit-level moderate'
                    }
                }
                stage('Docker Security Scan') {
                    when {
                        anyOf {
                            branch 'main'
                            branch 'develop'
                        }
                    }
                    steps {
                        script {
                            sh '''
                                # Install trivy if not present
                                if ! command -v trivy &> /dev/null; then
                                    wget -qO- https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
                                    echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
                                    sudo apt-get update && sudo apt-get install trivy
                                fi
                                
                                # Scan core services
                                trivy image --severity HIGH,CRITICAL ${DOCKER_REGISTRY}/proposal-svc:${BUILD_NUMBER}
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Integration Tests') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                sh '''
                    # Start test environment
                    docker-compose -f docker-compose.test.yml up -d
                    
                    # Wait for services to be ready
                    sleep 30
                    
                    # Run integration tests
                    npm run test:integration
                    
                    # Cleanup
                    docker-compose -f docker-compose.test.yml down
                '''
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    sh '''
                        # Deploy to staging namespace
                        kubectl config set-context --current --namespace=liger-staging
                        
                        # Update deployment images
                        kubectl set image deployment/proposal-svc proposal-svc=${DOCKER_REGISTRY}/proposal-svc:${BUILD_NUMBER}
                        kubectl set image deployment/approval-svc approval-svc=${DOCKER_REGISTRY}/approval-svc:${BUILD_NUMBER}
                        kubectl set image deployment/gift-svc gift-svc=${DOCKER_REGISTRY}/gift-svc:${BUILD_NUMBER}
                        
                        # Wait for rollout
                        kubectl rollout status deployment/proposal-svc --timeout=300s
                        kubectl rollout status deployment/approval-svc --timeout=300s
                        kubectl rollout status deployment/gift-svc --timeout=300s
                    '''
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to Production?', ok: 'Deploy'
                script {
                    sh '''
                        # Deploy to production namespace
                        kubectl config set-context --current --namespace=liger-production
                        
                        # Rolling update with health checks
                        kubectl set image deployment/proposal-svc proposal-svc=${DOCKER_REGISTRY}/proposal-svc:${BUILD_NUMBER}
                        kubectl rollout status deployment/proposal-svc --timeout=600s
                        
                        kubectl set image deployment/approval-svc approval-svc=${DOCKER_REGISTRY}/approval-svc:${BUILD_NUMBER}
                        kubectl rollout status deployment/approval-svc --timeout=600s
                        
                        # Verify deployment health
                        kubectl get pods -l app=proposal-svc
                        kubectl get pods -l app=approval-svc
                    '''
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            script {
                if (env.BRANCH_NAME == 'main') {
                    slackSend(
                        channel: '#deployments',
                        color: 'good',
                        message: "✅ LIGER Platform deployed successfully to Production - Build #${BUILD_NUMBER}"
                    )
                }
            }
        }
        failure {
            script {
                slackSend(
                    channel: '#deployments',
                    color: 'danger',
                    message: "❌ LIGER Platform build failed - Build #${BUILD_NUMBER}\nBranch: ${BRANCH_NAME}"
                )
            }
        }
    }
}