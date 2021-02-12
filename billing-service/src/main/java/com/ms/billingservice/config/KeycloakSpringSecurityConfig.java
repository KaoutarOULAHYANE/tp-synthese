package com.ms.billingservice.config;

import org.keycloak.adapters.springsecurity.KeycloakConfiguration;
import org.keycloak.adapters.springsecurity.config.KeycloakWebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.web.authentication.session.RegisterSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;

/*Adapter keycloak avec web security*/
@KeycloakConfiguration
public class KeycloakSpringSecurityConfig extends KeycloakWebSecurityConfigurerAdapter {
    /*Préciser la stratégie de la gestion de la session*/
    @Override
    protected SessionAuthenticationStrategy sessionAuthenticationStrategy() {
        /*Utiliser un gestionnaire des sessions classique*/
        return new RegisterSessionAuthenticationStrategy(new SessionRegistryImpl());
    }

    /*Spécifier à spring security l'emplacement des users et roles (BD, ...)*/
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        /*super.configure(auth);*/
        /*Déléguer la gestion des users et roles au serveur keycloak*/
        auth.authenticationProvider(keycloakAuthenticationProvider());
    }

    /*Spécifier les autorisations*/
    @Override
    public void configure(HttpSecurity http) throws Exception {
        super.configure(http);
        http.csrf().disable();
        /*Accès à cette ressources nécessite une authentification*/
        http.authorizeRequests().antMatchers("/bills/**").hasAuthority("admin");
    }
}
