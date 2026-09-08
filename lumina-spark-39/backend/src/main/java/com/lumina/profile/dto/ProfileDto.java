package com.lumina.profile.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

public class ProfileDto {

    private String avatar;
    @NotBlank @Size(max = 120)
    private String fullName;
    @Size(max = 80)
    private String username;
    @Email @Size(max = 180)
    private String email;
    @Size(max = 32)
    private String phone;
    @Size(max = 20)
    private String dob;
    @Size(max = 20)
    private String gender;
    @Size(max = 80)
    private String city;
    @Size(max = 80)
    private String stateName;
    @Size(max = 80)
    private String country;
    @Size(max = 400)
    private String address;
    @Valid
    private List<ChipDto> languages = new ArrayList<>();

    @Size(max = 160)
    private String college;
    @Size(max = 160)
    private String university;
    @Size(max = 160)
    private String department;
    @Size(max = 80)
    private String branch;
    @Size(max = 10)
    private String semester;
    @Size(max = 40)
    private String usn;
    @Size(max = 10)
    private String gradYear;
    @Size(max = 10)
    private String cgpa;
    @Size(max = 10)
    private String backlogs;

    @Size(max = 600)
    private String objective;
    @Size(max = 2000)
    private String about;
    @Size(max = 300)
    private String portfolio;
    @Size(max = 300)
    private String github;
    @Size(max = 300)
    private String linkedin;
    @Size(max = 80)
    private String leetcode;
    @Size(max = 80)
    private String hackerrank;
    @Size(max = 80)
    private String codechef;
    @Size(max = 80)
    private String codeforces;
    @Size(max = 80)
    private String kaggle;

    @Valid private List<ChipDto> langs = new ArrayList<>();
    @Valid private List<ChipDto> frameworks = new ArrayList<>();
    @Valid private List<ChipDto> databases = new ArrayList<>();
    @Valid private List<ChipDto> cloud = new ArrayList<>();
    @Valid private List<ChipDto> devops = new ArrayList<>();
    @Valid private List<ChipDto> aiSkills = new ArrayList<>();
    @Valid private List<ChipDto> soft = new ArrayList<>();

    @Valid private List<ExperienceDto> experience = new ArrayList<>();
    @Valid private List<EducationDto> education = new ArrayList<>();
    @Valid private List<CertificationDto> certs = new ArrayList<>();
    @Valid private List<AchievementDto> achievements = new ArrayList<>();

    private boolean darkMode = true;
    private boolean notifications = true;
    private boolean emailPrefs = true;
    private boolean publicProfile = true;
    private boolean placementVisible = true;

    private ProfileCompletionDto completion;

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getStateName() { return stateName; }
    public void setStateName(String stateName) { this.stateName = stateName; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public List<ChipDto> getLanguages() { return languages; }
    public void setLanguages(List<ChipDto> languages) { this.languages = languages; }
    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }
    public String getUniversity() { return university; }
    public void setUniversity(String university) { this.university = university; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }
    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
    public String getUsn() { return usn; }
    public void setUsn(String usn) { this.usn = usn; }
    public String getGradYear() { return gradYear; }
    public void setGradYear(String gradYear) { this.gradYear = gradYear; }
    public String getCgpa() { return cgpa; }
    public void setCgpa(String cgpa) { this.cgpa = cgpa; }
    public String getBacklogs() { return backlogs; }
    public void setBacklogs(String backlogs) { this.backlogs = backlogs; }
    public String getObjective() { return objective; }
    public void setObjective(String objective) { this.objective = objective; }
    public String getAbout() { return about; }
    public void setAbout(String about) { this.about = about; }
    public String getPortfolio() { return portfolio; }
    public void setPortfolio(String portfolio) { this.portfolio = portfolio; }
    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }
    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }
    public String getLeetcode() { return leetcode; }
    public void setLeetcode(String leetcode) { this.leetcode = leetcode; }
    public String getHackerrank() { return hackerrank; }
    public void setHackerrank(String hackerrank) { this.hackerrank = hackerrank; }
    public String getCodechef() { return codechef; }
    public void setCodechef(String codechef) { this.codechef = codechef; }
    public String getCodeforces() { return codeforces; }
    public void setCodeforces(String codeforces) { this.codeforces = codeforces; }
    public String getKaggle() { return kaggle; }
    public void setKaggle(String kaggle) { this.kaggle = kaggle; }
    public List<ChipDto> getLangs() { return langs; }
    public void setLangs(List<ChipDto> langs) { this.langs = langs; }
    public List<ChipDto> getFrameworks() { return frameworks; }
    public void setFrameworks(List<ChipDto> frameworks) { this.frameworks = frameworks; }
    public List<ChipDto> getDatabases() { return databases; }
    public void setDatabases(List<ChipDto> databases) { this.databases = databases; }
    public List<ChipDto> getCloud() { return cloud; }
    public void setCloud(List<ChipDto> cloud) { this.cloud = cloud; }
    public List<ChipDto> getDevops() { return devops; }
    public void setDevops(List<ChipDto> devops) { this.devops = devops; }
    public List<ChipDto> getAiSkills() { return aiSkills; }
    public void setAiSkills(List<ChipDto> aiSkills) { this.aiSkills = aiSkills; }
    public List<ChipDto> getSoft() { return soft; }
    public void setSoft(List<ChipDto> soft) { this.soft = soft; }
    public List<ExperienceDto> getExperience() { return experience; }
    public void setExperience(List<ExperienceDto> experience) { this.experience = experience; }
    public List<EducationDto> getEducation() { return education; }
    public void setEducation(List<EducationDto> education) { this.education = education; }
    public List<CertificationDto> getCerts() { return certs; }
    public void setCerts(List<CertificationDto> certs) { this.certs = certs; }
    public List<AchievementDto> getAchievements() { return achievements; }
    public void setAchievements(List<AchievementDto> achievements) { this.achievements = achievements; }
    public boolean isDarkMode() { return darkMode; }
    public void setDarkMode(boolean darkMode) { this.darkMode = darkMode; }
    public boolean isNotifications() { return notifications; }
    public void setNotifications(boolean notifications) { this.notifications = notifications; }
    public boolean isEmailPrefs() { return emailPrefs; }
    public void setEmailPrefs(boolean emailPrefs) { this.emailPrefs = emailPrefs; }
    public boolean isPublicProfile() { return publicProfile; }
    public void setPublicProfile(boolean publicProfile) { this.publicProfile = publicProfile; }
    public boolean isPlacementVisible() { return placementVisible; }
    public void setPlacementVisible(boolean placementVisible) { this.placementVisible = placementVisible; }
    public ProfileCompletionDto getCompletion() { return completion; }
    public void setCompletion(ProfileCompletionDto completion) { this.completion = completion; }
}
