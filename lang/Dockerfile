#FROM k8s.gcr.io/kube-apiserver:v1.12.0
FROM java:8
VOLUME ./tmp
add eureka-server-1.0-SNAPSHOT.jar app.jar
#RUN bach -c 'touch /app.jar'
EXPOSE 8761
ENTRYPOINT ["java","-jar","/app.jar"]
