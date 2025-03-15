# Simple OAuth2.0 with Keycloak, Spring Boot, and Angular

This project demonstrates a simple OAuth2.0 implementation using **Keycloak as the Identity Provider**, **Spring Boot as the backend**, and **Angular as the frontend**.

## 🎯 **Project Overview**

- **Keycloak**: Handles user authentication and role-based authorization.
- **Spring Boot**: Backend API with role-based access control.
- **Angular**: Frontend to interact with secured APIs.

## ✅ **Features Implemented**

- OAuth2.0 Authorization Code Flow
- Keycloak JWT Token Extraction
- Role-based Authorization
- Secure API Endpoints
- Angular Frontend Integration

---

## 🛠️ **Tech Stack**

| Technology      | Version |
|----------------|---------|
| Keycloak       | 26.0.0  |
| Spring Boot    | 3.4.2   |
| Angular        | 18.0.0  |
| Java           | 21      |

---

## 🏁 **Project Setup**

### 1️⃣ **Keycloak Setup**

1. Run Keycloak server locally:

```bash
./kc.sh start-dev
```

2. Create a **Realm: `my-test-realm`**
3. Create a **Client: `springboot-client`**
4. Assign roles: `fullstack-developer`
5. Add users and assign roles

---

### 2️⃣ **Spring Boot Backend Setup**

#### Install Dependencies:
```bash
mvn clean install
```

#### Run the Application:
```bash
mvn spring-boot:run
```

### Backend APIs:
| Endpoint     | Role Required       | Status |
|--------------|----------------|---------|
| `/hello`     | `fullstack-developer` | ✅ Protected |

---

### 3️⃣ **Angular Frontend Setup**

#### Install Angular Dependencies:
```bash
npm install
```

#### Run Angular Application:
```bash
ng serve
```

---

## 🔑 **JWT Role Mapping from Keycloak**

In Keycloak's Access Token, the roles are present inside `resource_access`. Spring Security cannot directly access these roles.

### 🎯 Custom `JwtConverter` to extract roles:

```java
@Override
private List<GrantedAuthority> extractAuthorities(Jwt jwt) {
    var authorities = new ArrayList<GrantedAuthority>();

    Map<String, Object> resourceAccess = jwt.getClaimAsMap("resource_access");

    if (resourceAccess != null) {
        Map<String, Object> clientRoles = (Map<String, Object>) resourceAccess.get("my-test-realm");

        if (clientRoles != null && clientRoles.containsKey("roles")) {
            var roles = (List<String>) clientRoles.get("roles");
            roles.forEach(role ->
                authorities.add(new SimpleGrantedAuthority("ROLE_" + role))
            );
        }
    }

    return authorities;
}
```

---

## 🔐 **Securing Endpoints in Spring Boot**

```java
@GetMapping("/hello")
@PreAuthorize("hasAuthority('ROLE_fullstack-developer')")
public Message hello() {
    var jwt = (CustomJwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    return new Message("Hello " + jwt.getFirstName() + " " + jwt.getLastName());
}
```

---

## 🌐 **Angular Integration**

### Add Keycloak Service:

```typescript
keycloak.init({
  config: {
    url: 'http://localhost:8080',
    realm: 'my-test-realm',
    clientId: 'springboot-client'
  },
  initOptions: {
    onLoad: 'login-required',
    checkLoginIframe: false
  }
});
```

---

## ✅ **Result:**

- 🎯 Login with Keycloak
- 🎯 Access `/hello` API with `fullstack-developer` role
- 🎯 Access control based on JWT roles

---

## 📂 **Project Structure**

```
├── backend-springboot
│   ├── src/main/java
│   │   └── com/gokul/oauth2_0
│   │       ├── controller/HelloController.java
│   │       ├── jwt/CustomJwtConverter.java
│   │       └── config/SecurityConfig.java
│   └── pom.xml
│
└── frontend-angular
    ├── src
    │   ├── app
    │   │   ├── services/keycloak.service.ts
    │   │   └── components
    └── package.json
```

---

## 🚀 **To Run the Application**

1️⃣ Start Keycloak
2️⃣ Run Spring Boot Backend
3️⃣ Run Angular Frontend

---

## 🎯 **Future Enhancements**

- 🔥 Refresh Token Handling
- 🔥 Role-Based UI Rendering in Angular
- 🔥 Logout with Keycloak

---

## 🌟 **Contributors**
- [Gokul](https://github.com/GokulMithran)

