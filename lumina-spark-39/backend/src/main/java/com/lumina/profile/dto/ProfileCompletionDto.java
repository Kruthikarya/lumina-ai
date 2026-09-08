package com.lumina.profile.dto;

import java.util.List;

public record ProfileCompletionDto(int percent, List<String> missing) {}
