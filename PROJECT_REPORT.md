# Gym Management System - Project Report

## Environment Setup

### Operating System Selection and Justification
- **OS Choice**: Ubuntu 24.04.1 LTS
- **Justification**:
  1. Native Docker Support: Linux provides native Docker support, eliminating the need for virtualization layers like WSL or Docker Desktop
  2. Performance: Direct hardware access results in better performance for containers and Kubernetes
  3. Package Management: Advanced package management through apt makes tool installation straightforward
  4. Community Support: Extensive community support for DevOps tools and containerization
  5. Resource Efficiency: Lower overhead compared to running on Windows with WSL or VMs

### System Specifications
- **OS Version**: Ubuntu 24.04.1 LTS (Noble)
- **Kernel Version**: 6.11.0-25-generic
- **Docker Version**: 28.1.1
- **Minikube Version**: v1.35.0
- **Kubectl Version**: v1.32.4 (Client), v1.32.0 (Server)

## Step-by-Step Implementation

### 1. Environment Setup
```bash
# Install Docker
sudo apt update
sudo apt install docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Install Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install kubectl /usr/local/bin/kubectl
```

### 2. Application Development
- Created a full-stack Gym Management System using:
  - Frontend: React.js
  - Backend: Node.js/Express.js
  - Database: MongoDB
- Implemented features:
  - User Authentication
  - Member Management
  - Equipment Tracking
  - Workout Plans
  - Attendance Management

### 3. Containerization
```bash
# Build Docker images
docker build --target frontend -t saim814/gym-frontend:latest .
docker build --target backend -t saim814/gym-backend:latest .

# Push images to Docker Hub
docker push saim814/gym-frontend:latest
docker push saim814/gym-backend:latest
```

### 4. Kubernetes Deployment
```bash
# Start Minikube
minikube start

# Apply Kubernetes configurations
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# Verify deployment
kubectl get pods -o wide
kubectl get services -o wide
```

Current Deployment Status:
\`\`\`
Pods:
NAME                                     READY   STATUS    RESTARTS   AGE     IP            NODE       
gym-management-system-5555f7895d-hrhd5   2/2     Running   0          3h31m   10.244.0.13   minikube   
gym-management-system-5555f7895d-rvgz2   2/2     Running   0          3h32m   10.244.0.12   minikube   

Services:
NAME                     TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)                      AGE
gym-management-service   NodePort    10.109.103.6   <none>        5000:30007/TCP,80:30008/TCP  8h
\`\`\`

### 5. CI/CD Setup with GitHub Actions
- Created `.github/workflows/deploy.yml` for automated deployment
- Configured self-hosted runner for local Kubernetes deployment
- Set up secrets for Docker Hub authentication

## Issues Faced and Solutions

### 1. Docker Permission Issues
**Problem**: Permission denied while trying to connect to Docker daemon
**Solution**: 
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Minikube Node Port Access
**Problem**: Unable to access application through NodePort
**Solution**: Used `minikube service` command to create a tunnel
```bash
minikube service gym-management-service --url
```

### 3. GitHub Actions Runner Connection
**Problem**: Runner not picking up jobs
**Solution**: 
- Removed old runner configuration
- Generated new registration token
- Reconfigured runner with proper permissions
```bash
./config.sh remove
./config.sh --url https://github.com/SaimZia/SCD_PRoject --token <new_token>
```

### 4. Docker Build Context Issues
**Problem**: Build context too large, slow builds
**Solution**: Added proper `.dockerignore` file:
```
node_modules/
.git/
*.log
```

### 5. MongoDB Connection Issues
**Problem**: Backend unable to connect to MongoDB in Kubernetes
**Solution**: Created Kubernetes secret for MongoDB URI and updated deployment configuration
```bash
kubectl create secret generic mongodb-uri --from-literal=MONGO_URI=<connection_string>
```

### MongoDB Configuration and Troubleshooting

1. Create MongoDB Atlas Account and Database:
   - Sign up for MongoDB Atlas
   - Create a new cluster
   - Create a database user
   - Get your connection string

2. Configure MongoDB in Kubernetes:
   ```bash
   # Create MongoDB connection secret
   kubectl create secret generic mongodb-uri \
     --from-literal=MONGO_URI="mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority" \
     -n gym-system
   ```

3. Common Issues and Solutions:

   a. **Missing MongoDB Secret Error**
   ```bash
   # Symptom: Pods show CreateContainerConfigError
   kubectl get pods -n gym-system
   # Output shows: CreateContainerConfigError
   
   # Check pod details
   kubectl describe pod -n gym-system
   # Error message: "secret "mongodb-uri" not found"
   
   # Solution: Create the MongoDB secret
   kubectl create secret generic mongodb-uri \
     --from-literal=MONGO_URI="your-mongodb-connection-string" \
     -n gym-system
   
   # Restart the deployment
   kubectl rollout restart deployment gym-management-system -n gym-system
   
   # Wait for pods to be ready
   kubectl wait --for=condition=ready pod -l app=gym-management-system -n gym-system --timeout=180s
   ```

   b. **Service Unreachable Error**
   ```bash
   # Symptom: Service unreachable error when accessing URLs
   minikube service gym-management-service -n gym-system
   # Error: "service not available: no running pod for service"
   
   # Solution steps:
   # 1. Check pod status
   kubectl get pods -n gym-system
   
   # 2. Verify MongoDB secret exists
   kubectl get secrets -n gym-system
   
   # 3. Check service configuration
   kubectl get svc gym-management-service -n gym-system
   
   # 4. Get service URLs
   minikube service gym-management-service -n gym-system --url
   # Frontend URL: http://<minikube-ip>:31008
   # Backend API URL: http://<minikube-ip>:31007
   ```

### Quick Verification Steps

1. Verify all components are running:
   ```bash
   # Check pods
   kubectl get pods -n gym-system
   # Should show: 2/2 READY and Running status
   
   # Check services
   kubectl get svc -n gym-system
   # Should show: gym-management-service with NodePort
   
   # Check secrets
   kubectl get secrets -n gym-system
   # Should show: mongodb-uri secret
   ```

2. Access the application:
   ```bash
   # Get service URLs
   minikube service gym-management-service -n gym-system --url
   
   # Expected output:
   # http://<minikube-ip>:31007 (Backend)
   # http://<minikube-ip>:31008 (Frontend)
   ```

3. Monitor logs for issues:
   ```bash
   # Frontend logs
   kubectl logs -l app=gym-management-system -c gym-frontend -n gym-system
   
   # Backend logs
   kubectl logs -l app=gym-management-system -c gym-backend -n gym-system
   ```

## Project Running Instructions

### Prerequisites
1. Install required tools:
   ```bash
   # Update system
   sudo apt update
   sudo apt upgrade

   # Install Docker
   sudo apt install docker.io
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -aG docker $USER
   newgrp docker

   # Install Minikube
   curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
   sudo install minikube-linux-amd64 /usr/local/bin/minikube

   # Install kubectl
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   sudo install kubectl /usr/local/bin/kubectl
   ```

### Starting from Scratch
1. Clone the repository:
   ```bash
   git clone https://github.com/SaimZia/SCD_PRoject.git
   cd SCD_PRoject
   ```

2. Start Minikube cluster:
   ```bash
   # Start Minikube
   minikube start

   # Verify cluster is running
   minikube status
   kubectl cluster-info
   ```

3. Configure Docker to use Minikube's Docker daemon:
   ```bash
   eval $(minikube docker-env)
   ```

4. Set up MongoDB:
   ```bash
   # Create MongoDB secret (replace with your MongoDB URI)
   kubectl create namespace gym-system
   kubectl create secret generic mongodb-uri \
     --from-literal=MONGO_URI="mongodb+srv://your-username:your-password@your-cluster-url" \
     -n gym-system
   ```

5. Build Docker images:
   ```bash
   # Build frontend image
   docker build --target frontend -t saim814/gym-frontend:latest .
   
   # Build backend image
   docker build --target backend -t saim814/gym-backend:latest .
   
   # Verify images are built
   docker images | grep saim814
   ```

6. Deploy to Kubernetes:
   ```bash
   # Apply Kubernetes configurations
   kubectl apply -f deployment.yaml -n gym-system
   kubectl apply -f service.yaml -n gym-system
   
   # Verify deployments and services
   kubectl get deployments -n gym-system
   kubectl get services -n gym-system
   kubectl get pods -n gym-system
   ```

7. Set up GitHub Actions Runner (for CI/CD):
   ```bash
   # Create and navigate to actions-runner directory
   mkdir actions-runner && cd actions-runner
   
   # Download runner package
   curl -o actions-runner-linux-x64-2.323.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.323.0/actions-runner-linux-x64-2.323.0.tar.gz
   
   # Extract runner
   tar xzf ./actions-runner-linux-x64-2.323.0.tar.gz
   
   # Configure runner (replace TOKEN with your GitHub runner token)
   ./config.sh --url https://github.com/SaimZia/SCD_PRoject --token YOUR_TOKEN
   
   # Start runner
   ./run.sh
   ```

### Accessing the Application

1. Get service URLs:
   ```bash
   # Get URLs for both frontend and backend services
   minikube service gym-management-service --url -n gym-system
   ```

2. Access the application:
   - Frontend UI: Access through the NodePort URL (port 30008)
   - Backend API: Access through the NodePort URL (port 30007)

### Verifying the Deployment

1. Check pod status:
   ```bash
   # View pod status and logs
   kubectl get pods -n gym-system
   kubectl describe pods -n gym-system
   kubectl logs -n gym-system <pod-name> -c gym-frontend
   kubectl logs -n gym-system <pod-name> -c gym-backend
   ```

2. Check service status:
   ```bash
   kubectl get services -n gym-system
   kubectl describe service gym-management-service -n gym-system
   ```

3. Monitor resources:
   ```bash
   # Monitor CPU and memory usage
   kubectl top pods -n gym-system
   kubectl top nodes
   ```

### Troubleshooting

1. If pods are not running:
   ```bash
   # Check pod details
   kubectl describe pod <pod-name> -n gym-system
   
   # Check pod logs
   kubectl logs <pod-name> -n gym-system
   ```

2. If services are not accessible:
   ```bash
   # Check Minikube IP
   minikube ip
   
   # Check service details
   kubectl describe service gym-management-service -n gym-system
   ```

3. If images are not pulling:
   ```bash
   # Verify images are available locally
   docker images | grep saim814
   
   # Check image pull policy in deployment
   kubectl describe deployment gym-management-system -n gym-system
   ```

### Cleanup

1. Delete the deployment:
   ```bash
   kubectl delete -f deployment.yaml -n gym-system
   kubectl delete -f service.yaml -n gym-system
   ```

2. Stop Minikube:
   ```bash
   minikube stop
   ```

3. Delete Minikube cluster (if needed):
   ```bash
   minikube delete
   ```

## Conclusion
The project successfully implements a containerized full-stack application with automated deployment using GitHub Actions and Kubernetes. The use of Linux as the development environment proved beneficial for native container support and better resource utilization. The combination of React.js, Node.js, and MongoDB provides a scalable and maintainable solution for gym management.

### Running Website Locally with Minikube

1. Start Minikube tunnel (in a separate terminal):
   ```bash
   # Start minikube tunnel to enable LoadBalancer services
   sudo minikube tunnel
   ```

2. Get the Minikube IP:
   ```bash
   # Get Minikube IP address
   minikube ip
   ```

3. Access the website:
   ```bash
   # Get the NodePort URLs
   minikube service gym-management-service --url -n gym-system
   
   # Or use these commands to automatically open in browser
   minikube service gym-management-service -n gym-system
   ```

4. Quick start commands (all-in-one):
   ```bash
   # Start everything from scratch
   minikube start
   eval $(minikube docker-env)
   kubectl create namespace gym-system
   kubectl apply -f deployment.yaml -n gym-system
   kubectl apply -f service.yaml -n gym-system
   
   # Wait for pods to be ready
   kubectl wait --for=condition=ready pod -l app=gym-management-system -n gym-system --timeout=180s
   
   # Open the website
   minikube service gym-management-service -n gym-system
   ```

5. Development workflow commands:
   ```bash
   # View the website without opening browser
   minikube service list -n gym-system
   
   # Get specific URLs
   echo "Frontend URL: http://$(minikube ip):30008"
   echo "Backend API URL: http://$(minikube ip):30007"
   
   # Monitor the application
   kubectl get pods -n gym-system -w
   
   # View logs in real-time
   kubectl logs -f -l app=gym-management-system -n gym-system
   ```

6. Useful debugging commands:
   ```bash
   # Check if services are running
   kubectl get all -n gym-system
   
   # Check pod logs
   kubectl logs -f deployment/gym-management-system -n gym-system -c gym-frontend
   kubectl logs -f deployment/gym-management-system -n gym-system -c gym-backend
   
   # Check pod details
   kubectl describe pod -l app=gym-management-system -n gym-system
   
   # Check service endpoints
   kubectl get endpoints -n gym-system
   ```

7. Stop the application:
   ```bash
   # Stop the services
   kubectl delete -f service.yaml -n gym-system
   kubectl delete -f deployment.yaml -n gym-system
   
   # Stop Minikube (optional)
   minikube stop
   ```

### Common Local Development Tasks

1. Rebuild and redeploy after code changes:
   ```bash
   # Rebuild Docker images
   eval $(minikube docker-env)
   docker build --target frontend -t saim814/gym-frontend:latest .
   docker build --target backend -t saim814/gym-backend:latest .
   
   # Restart the deployment
   kubectl rollout restart deployment gym-management-system -n gym-system
   ```

2. View application logs:
   ```bash
   # Frontend logs
   kubectl logs -f -l app=gym-management-system -c gym-frontend -n gym-system
   
   # Backend logs
   kubectl logs -f -l app=gym-management-system -c gym-backend -n gym-system
   ```

3. Access the application directly:
   ```bash
   # Get NodePort URLs
   MINIKUBE_IP=$(minikube ip)
   echo "Frontend: http://$MINIKUBE_IP:30008"
   echo "Backend API: http://$MINIKUBE_IP:30007"
   ```

4. Quick health check:
   ```bash
   # Check all resources
   kubectl get all -n gym-system
   
   # Check pod health
   kubectl describe pods -n gym-system | grep -A 5 "Events:"
   
   # Check service endpoints
   kubectl get endpoints -n gym-system
   ``` 