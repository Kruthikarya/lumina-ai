package com.lumina.profile.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", unique = true)
    private Student student;

    @Column(length = 500)
    private String avatar;

    @Column(name = "avatar_bytes")
    private byte[] avatarBytes;

    @Column(length = 80)
    private String avatarContentType;

    @Column(length = 120)
    private String fullName;
    @Column(length = 80)
    private String username;
    @Column(length = 180)
    private String email;
    @Column(length = 32)
    private String phone;
    @Column(length = 20)
    private String dob;
    @Column(length = 20)
    private String gender;
    @Column(length = 80)
    private String city;
    @Column(length = 80)
    private String stateName;
    @Column(length = 80)
    private String country;
    @Column(length = 400)
    private String address;

    @Column(length = 160)
    private String college;
    @Column(length = 160)
    private String university;
    @Column(length = 160)
    private String department;
    @Column(length = 80)
    private String branch;
    @Column(length = 10)
    private String semester;
    @Column(length = 40)
    private String usn;
    @Column(length = 10)
    private String gradYear;
    @Column(length = 10)
    private String cgpa;
    @Column(length = 10)
    private String backlogs;

    @Column(length = 600)
    private String objective;
    @Column(length = 2000)
    private String about;
    @Column(length = 300)
    private String portfolio;
    @Column(length = 300)
    private String github;
    @Column(length = 300)
    private String linkedin;
    @Column(length = 80)
    private String leetcode;
    @Column(length = 80)
    private String hackerrank;
    @Column(length = 80)
    private String codechef;
    @Column(length = 80)
    private String codeforces;
    @Column(length = 80)
    private String kaggle;

    private boolean darkMode = true;
    private boolean notifications = true;
    private boolean emailPrefs = true;
    private boolean publicProfile = true;
    private boolean placementVisible = true;

    private Instant createdAt;
    private Instant updatedAt;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Skill> skills = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Education> education = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Experience> experience = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Certification> certifications = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Achievement> achievements = new ArrayList<>();

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public byte[] getAvatarBytes() {
        return avatarBytes;
    }

    public void setAvatarBytes(byte[] avatarBytes) {
        this.avatarBytes = avatarBytes;
    }

    public String getAvatarContentType() {
        return avatarContentType;
    }

    public void setAvatarContentType(String avatarContentType) {
        this.avatarContentType = avatarContentType;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStateName() {
        return stateName;
    }

    public void setStateName(String stateName) {
        this.stateName = stateName;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getUniversity() {
        return university;
    }

    public void setUniversity(String university) {
        this.university = university;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public String getUsn() {
        return usn;
    }

    public void setUsn(String usn) {
        this.usn = usn;
    }

    public String getGradYear() {
        return gradYear;
    }

    public void setGradYear(String gradYear) {
        this.gradYear = gradYear;
    }

    public String getCgpa() {
        return cgpa;
    }

    public void setCgpa(String cgpa) {
        this.cgpa = cgpa;
    }

    public String getBacklogs() {
        return backlogs;
    }

    public void setBacklogs(String backlogs) {
        this.backlogs = backlogs;
    }

    public String getObjective() {
        return objective;
    }

    public void setObjective(String objective) {
        this.objective = objective;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public String getPortfolio() {
        return portfolio;
    }

    public void setPortfolio(String portfolio) {
        this.portfolio = portfolio;
    }

    public String getGithub() {
        return github;
    }

    public void setGithub(String github) {
        this.github = github;
    }

    public String getLinkedin() {
        return linkedin;
    }

    public void setLinkedin(String linkedin) {
        this.linkedin = linkedin;
    }

    public String getLeetcode() {
        return leetcode;
    }

    public void setLeetcode(String leetcode) {
        this.leetcode = leetcode;
    }

    public String getHackerrank() {
        return hackerrank;
    }

    public void setHackerrank(String hackerrank) {
        this.hackerrank = hackerrank;
    }

    public String getCodechef() {
        return codechef;
    }

    public void setCodechef(String codechef) {
        this.codechef = codechef;
    }

    public String getCodeforces() {
        return codeforces;
    }

    public void setCodeforces(String codeforces) {
        this.codeforces = codeforces;
    }

    public String getKaggle() {
        return kaggle;
    }

    public void setKaggle(String kaggle) {
        this.kaggle = kaggle;
    }

    public boolean isDarkMode() {
        return darkMode;
    }

    public void setDarkMode(boolean darkMode) {
        this.darkMode = darkMode;
    }

    public boolean isNotifications() {
        return notifications;
    }

    public void setNotifications(boolean notifications) {
        this.notifications = notifications;
    }

    public boolean isEmailPrefs() {
        return emailPrefs;
    }

    public void setEmailPrefs(boolean emailPrefs) {
        this.emailPrefs = emailPrefs;
    }

    public boolean isPublicProfile() {
        return publicProfile;
    }

    public void setPublicProfile(boolean publicProfile) {
        this.publicProfile = publicProfile;
    }

    public boolean isPlacementVisible() {
        return placementVisible;
    }

    public void setPlacementVisible(boolean placementVisible) {
        this.placementVisible = placementVisible;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public List<Skill> getSkills() {
        return skills;
    }

    public List<Education> getEducation() {
        return education;
    }

    public List<Experience> getExperience() {
        return experience;
    }

    public List<Certification> getCertifications() {
        return certifications;
    }

    public List<Achievement> getAchievements() {
        return achievements;
    }
}
