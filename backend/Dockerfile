FROM eclipse-temurin:25-jre
WORKDIR /app

# Copy the pre-built JAR from the target directory
COPY target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]