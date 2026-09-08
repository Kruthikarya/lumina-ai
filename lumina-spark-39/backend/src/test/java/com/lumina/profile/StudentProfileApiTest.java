package com.lumina.profile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lumina.profile.dto.ProfileDtos.EducationDto;
import com.lumina.profile.dto.ProfileDtos.LoginRequest;
import com.lumina.profile.dto.ProfileDtos.ProfilePayload;
import com.lumina.profile.dto.ProfileDtos.RegisterRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class StudentProfileApiTest {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;

    private String tokenA;
    private String tokenB;

    @BeforeEach
    void registerStudents() throws Exception {
        tokenA = register("Aarav", "Sharma", "aarav@uni.edu", "password1", "SJCIT");
        tokenB = register("Diya", "Iyer", "diya@uni.edu", "password1", "RVCE");
    }

    @Test
    void unauthenticatedProfileIsRejected() throws Exception {
        mvc.perform(get("/api/student/profile")).andExpect(status().isForbidden());
    }

    @Test
    void getAndUpdateOwnProfile() throws Exception {
        mvc.perform(get("/api/student/profile").header("Authorization", bearer(tokenA)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName", is("Aarav Sharma")))
                .andExpect(jsonPath("$.email", is("aarav@uni.edu")))
                .andExpect(jsonPath("$.college", is("SJCIT")));

        ProfilePayload payload = new ProfilePayload();
        payload.fullName = "Aarav S.";
        payload.email = "aarav@uni.edu";
        payload.phone = "+91 9000000000";
        payload.about = "Full-stack intern";
        payload.github = "https://github.com/aarav";
        payload.linkedin = "https://linkedin.com/in/aarav";
        payload.portfolio = "https://aarav.dev";
        payload.cgpa = "9.1";
        payload.langs = List.of(new com.lumina.profile.dto.ProfileDtos.ChipDto(null, "TypeScript"));
        payload.experience = List.of(new com.lumina.profile.dto.ProfileDtos.ExperienceDto(
                null, "Razorpay", "Intern", "2025", "Fraud dashboard"));
        payload.certs = List.of(new com.lumina.profile.dto.ProfileDtos.CertificationDto(
                null, "AWS CCP", "Amazon", "2025", ""));

        mvc.perform(put("/api/student/profile")
                        .header("Authorization", bearer(tokenA))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName", is("Aarav S.")))
                .andExpect(jsonPath("$.experience", hasSize(1)))
                .andExpect(jsonPath("$.certs", hasSize(1)))
                .andExpect(jsonPath("$.completionPercent", greaterThanOrEqualTo(50)));
    }

    @Test
    void studentCannotSeeAnotherProfile() throws Exception {
        ProfilePayload payload = new ProfilePayload();
        payload.fullName = "Secret Diya";
        payload.email = "diya@uni.edu";
        mvc.perform(put("/api/student/profile")
                        .header("Authorization", bearer(tokenB))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(payload)))
                .andExpect(status().isOk());

        mvc.perform(get("/api/student/profile").header("Authorization", bearer(tokenA)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName", is("Aarav Sharma")))
                .andExpect(jsonPath("$.fullName", not("Secret Diya")));
    }

    @Test
    void educationExperienceCertsAchievementsCrud() throws Exception {
        String auth = bearer(tokenA);

        MvcResult edu = mvc.perform(post("/api/student/profile/education").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(new EducationDto(null, "B.E. CSE", "SJCIT", "2026", "9.1"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.degree", is("B.E. CSE")))
                .andReturn();
        String eduId = mapper.readTree(edu.getResponse().getContentAsString()).get("id").asText();

        mvc.perform(put("/api/student/profile/education/" + eduId).header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(new EducationDto(eduId, "B.E. CSE", "SJCIT", "2022-2026", "9.2"))))
                .andExpect(jsonPath("$.score", is("9.2")));

        mvc.perform(post("/api/student/profile/experience").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of("company", "Razorpay", "role", "Intern", "duration", "Summer", "description", "Work"))))
                .andExpect(status().isCreated());

        mvc.perform(post("/api/student/profile/certifications").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of("name", "GCP ACE", "org", "Google", "date", "2025", "url", ""))))
                .andExpect(status().isCreated());

        mvc.perform(post("/api/student/profile/achievements").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of("title", "SIH Winner", "type", "Hackathon", "year", "2025"))))
                .andExpect(status().isCreated());

        mvc.perform(get("/api/student/profile/education").header("Authorization", auth))
                .andExpect(jsonPath("$", hasSize(1)));
        mvc.perform(get("/api/student/profile/experience").header("Authorization", auth))
                .andExpect(jsonPath("$", hasSize(1)));
        mvc.perform(get("/api/student/profile/certifications").header("Authorization", auth))
                .andExpect(jsonPath("$", hasSize(1)));
        mvc.perform(get("/api/student/profile/achievements").header("Authorization", auth))
                .andExpect(jsonPath("$", hasSize(1)));

        mvc.perform(delete("/api/student/profile/education/" + eduId).header("Authorization", auth))
                .andExpect(status().isNoContent());
        mvc.perform(get("/api/student/profile/education").header("Authorization", auth))
                .andExpect(jsonPath("$", hasSize(0)));

        mvc.perform(put("/api/student/profile/education/" + eduId).header("Authorization", bearer(tokenB))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(new EducationDto(eduId, "Hacked", "Nope", "1", "1"))))
                .andExpect(status().isNotFound());
    }

    @Test
    void skillsAndCompletionAndImage() throws Exception {
        String auth = bearer(tokenA);
        mvc.perform(put("/api/student/profile/skills").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"langs":[{"label":"Python"}],"frameworks":[{"label":"React"}],"aiSkills":[{"label":"PyTorch"}]}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.langs", hasSize(1)));

        mvc.perform(get("/api/student/profile/completion").header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.percent").exists())
                .andExpect(jsonPath("$.missing").isArray());

        MockMultipartFile image = new MockMultipartFile("file", "avatar.png", "image/png", pngBytes());
        mvc.perform(multipart("/api/student/profile/image").file(image).header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.avatarUrl").isString());
    }

    @Test
    void validationRejectsShortPasswordAndBlankName() throws Exception {
        mvc.perform(post("/api/auth/student/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(new RegisterRequest("A", "B", "ab@uni.edu", "short", null, null))))
                .andExpect(status().isBadRequest());

        mvc.perform(put("/api/student/profile")
                        .header("Authorization", bearer(tokenA))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void loginRoundTrip() throws Exception {
        mvc.perform(post("/api/auth/student/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(new LoginRequest("aarav@uni.edu", "password1"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString());
    }

    private String register(String first, String last, String email, String password, String college) throws Exception {
        MvcResult result = mvc.perform(post("/api/auth/student/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(new RegisterRequest(first, last, email, password, college, "CSE"))))
                .andExpect(status().isCreated())
                .andReturn();
        return mapper.readTree(result.getResponse().getContentAsString()).get("token").asText();
    }

    private static String bearer(String token) {
        return "Bearer " + token;
    }

    private static byte[] pngBytes() {
        return new byte[]{
                (byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
                0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
                0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
                0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, (byte) 0xC4,
                (byte) 0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41, 0x54,
                0x78, (byte) 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01,
                0x0D, 0x0A, 0x2D, (byte) 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45,
                0x4E, 0x44, (byte) 0xAE, 0x42, 0x60, (byte) 0x82
        };
    }
}
