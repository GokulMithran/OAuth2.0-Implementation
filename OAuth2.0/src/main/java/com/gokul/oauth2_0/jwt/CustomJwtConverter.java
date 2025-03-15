package com.gokul.oauth2_0.jwt;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class CustomJwtConverter implements Converter<Jwt, CustomJwt> {

    @Override
    public CustomJwt convert(Jwt jwt) {
        List<GrantedAuthority> grantedAuthorities = extractAuthorities(jwt);
        var customJwt = new CustomJwt(jwt, grantedAuthorities);
        customJwt.setFirstName(jwt.getClaim("given_name"));
        customJwt.setLastName(jwt.getClaim("family_name"));
        return customJwt;
    }

    private List<GrantedAuthority> extractAuthorities(Jwt jwt) {
        var authorities = new ArrayList<GrantedAuthority>();

        // ✅ Extract roles from `resource_access`
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
}
