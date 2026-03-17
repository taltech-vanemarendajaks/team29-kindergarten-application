plugins {
    java
    id("org.springframework.boot") version "4.0.3"
    id("io.spring.dependency-management") version "1.1.7"
    id("org.openapi.generator") version "7.10.0"
}

group = "com.team29"
version = "0.0.1-SNAPSHOT"
description = "backend"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(25)
    }
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-flyway")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-webmvc")
    implementation("org.flywaydb:flyway-database-postgresql")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:3.0.2")
    implementation(platform("me.paulschwarz:spring-dotenv-bom:5.1.0"))
    developmentOnly("me.paulschwarz:springboot4-dotenv:5.1.0")
    compileOnly("org.projectlombok:lombok")
    runtimeOnly("org.postgresql:postgresql")
    annotationProcessor("org.projectlombok:lombok")
    testImplementation("org.springframework.boot:spring-boot-starter-actuator-test")
    testImplementation("org.springframework.boot:spring-boot-starter-data-jpa-test")
    testImplementation("org.springframework.boot:spring-boot-starter-flyway-test")
    testImplementation("org.springframework.boot:spring-boot-starter-security-test")
    testImplementation("org.springframework.boot:spring-boot-starter-validation-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
    implementation("org.mapstruct:mapstruct:1.6.0")
    annotationProcessor("org.mapstruct:mapstruct-processor:1.6.0")
    testRuntimeOnly("com.h2database:h2")
}

// OpenAPI generation

val generatedDir = layout.buildDirectory.dir("generated/openapi").get().asFile.path

openApiGenerate {
    generatorName.set("spring")
    inputSpec.set("$rootDir/../openapi/openapi.bundled.yaml")
    outputDir.set(generatedDir)

    apiPackage.set("com.team29.kindergarten.generated.api")
    modelPackage.set("com.team29.kindergarten.generated.model")

    configOptions.set(mapOf(
        "interfaceOnly"         to "true",
        "openApiNullable"       to "false",
        "useSpringBoot3"        to "true",
        "useTags"               to "true",
        "dateLibrary"           to "java8",
        "useBeanValidation"     to "true",
        "useJakartaEe"          to "true",
        "serializationLibrary"  to "jackson",
        "documentationProvider" to "none",
        "additionalModelTypeAnnotations" to "@lombok.Data",
    ))
}

sourceSets {
    main {
        java {
            srcDir("$generatedDir/src/main/java")
        }
    }
}

tasks.named("compileJava") {
    dependsOn(tasks.named("openApiGenerate"))
}

tasks.withType<Test> {
    useJUnitPlatform()
}