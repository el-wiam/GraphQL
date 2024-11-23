package ma.projet.graph;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/GraphQL") 
                .allowedOrigins("http://localhost:3000")  
                .allowedMethods("GET", "POST")
                .allowedHeaders("*"); 
    }
}
