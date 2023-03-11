package org.project.config;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
class CORSFilter implements Filter {

    final String CORS_ORIGIN = Constants.CORS_ORIGIN;
    final String CORS_METHODS = Constants.CORS_METHODS;
    final String CORS_ALLOW_HEADERS = Constants.CORS_ALLOW_HEADERS;
    final boolean CORS_ALLOW_CREDENTIALS = Constants.CORS_ALLOW_CREDENTIALS;

    @Override
    public void init(FilterConfig filterConfig) {
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        response.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
        response.setHeader("Access-Control-Allow-Credentials", String.valueOf(CORS_ALLOW_CREDENTIALS));

        if ("OPTIONS".equals(request.getMethod())) {
            response.setHeader("Access-Control-Allow-Methods", CORS_METHODS);
            response.setHeader("Access-Control-Allow-Headers", CORS_ALLOW_HEADERS);
            response.setHeader("Access-Control-Max-Age", "3600");

            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            chain.doFilter(req, res);
        }

    }

    @Override
    public void destroy() {
    }

}
