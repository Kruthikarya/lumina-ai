package com.lumina.profile.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import com.lumina.profile.user.StudentUser;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    @Column(length = 36)
    private String id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private StudentUser user;

    @Column(length = 1024)
    private String avatar;
    private String fullName;
    private String username;
    private String email;
    private String phone;
    private String dob;
    private String gender;
    private String city;
    private String stateName;
    private String country;
    @Column(length = 2000)
    private String address;

    private String college;
    private String university;
    private String department;
    private String branch;
    private String semester;
    private String usn;
    private String gradYear;
    private String cgpa;
    private String backlogs;

    @Column(length = 4000)
    private String objective;
    @Column(length = 8000)
    private String about;
    private String portfolio;
    private String github;
    private String linkedin;
    private String leetcode;
    private String hackerrank;
    private String codechef;
    private String codeforces;
    private String kaggle;

    private boolean darkMode = true;
    private boolean notifications = true;
    private boolean emailPrefs = true;
    private boolean publicProfile = true;
    private boolean placementVisible = true;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<ProfileSkill> skills = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<Education> education = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<Experience> experience = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<Certification> certifications = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<Achievement> achievements = new ArrayList<>();

    @PrePersist
    void onCreate() {
        if (id == null) id = UUID.randomUUID().toString();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public StudentUser getUser() { return user; }
    public void setUser(StudentUser user) { this.user = user; }
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
    public List<ProfileSkill> getSkills() { return skills; }
    public List<Education> getEducation() { return education; }
    public List<Experience> getExperience() { return experience; }
    public List<Certification> getCertifications() { return certifications; }
    public List<Achievement> getAchievements() { return achievements; }
}
