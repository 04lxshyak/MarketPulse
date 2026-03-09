package com.lakshya.auth.service;

import com.lakshya.auth.dto.AuthResponse;
import com.lakshya.auth.dto.LoginRequest;
import com.lakshya.auth.dto.RegisterRequest;

public interface AuthService {

    String register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

}