package com.team29.kindergarten.security;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;



@Component
public class JwtChannelInterceptor implements ChannelInterceptor {
public final JwtAuthenticationFactory authFactory;

 public JwtChannelInterceptor(JwtAuthenticationFactory authFactory) {
        this.authFactory = authFactory;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

       if (accessor.getCommand() == StompCommand.CONNECT) {

            System.out.println("CONNECT received");
            System.out.println("Command: " + accessor.getCommand());

            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("No valid Authorization header found in WebSocket CONNECT");
                throw new AccessDeniedException("Missing token");}
             
            String token = authHeader.substring(7);

            var auth = authFactory.createAuthentication(token);

            if (auth != null) {
                accessor.setUser(auth);
                    // need to store auth in session attributes for later retrieval in validateTenantAccess
                accessor.getSessionAttributes().put("SPRING.AUTH", auth);
                System.out.println("Destination: " + accessor.getDestination());
                System.out.println("User: " + accessor.getUser());
            }


        } else if (accessor.getCommand() == StompCommand.SUBSCRIBE) {

             System.out.println("SUBSCRIBE received");
             System.out.println("Destination: " + accessor.getDestination());
            
            if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
                    try {
                            validateTenantAccess(accessor);
                        } catch (Exception e) {
                           // e.printStackTrace(); 
                            throw e;
                        }
                }

        }

        return message;
    }

    private void validateTenantAccess(StompHeaderAccessor accessor) {
        String destination = accessor.getDestination();

        if (destination == null) {
            destination = accessor.getFirstNativeHeader("destination");
            System.out.println("Destination (resolved from native header): " + destination);            
        }

        if (destination == null) {
                throw new AccessDeniedException("Missing destination");
            }        

        if (destination == null || !destination.startsWith("/topic/tenant/")) {
                    
            throw new AccessDeniedException("Invalid topic");
        }

        Authentication auth = (Authentication) accessor.getUser();

        // restore auth if missing
        if (auth == null) {
            auth = (Authentication) accessor.getSessionAttributes().get("SPRING.AUTH");
            accessor.setUser(auth);
        }

        if (auth == null || !auth.isAuthenticated()) {
            throw new AccessDeniedException("Unauthenticated");
        }

        String[] parts = destination.split("/");
        if (parts.length < 4) {
            throw new AccessDeniedException("Invalid destination");
        }

        String tenantIdFromPath = parts[3];

        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();

        if (!tenantIdFromPath.equals(String.valueOf(principal.getTenantId()))) {
            throw new AccessDeniedException("Forbidden: tenant mismatch");
        }
    }

}