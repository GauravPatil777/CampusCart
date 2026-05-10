import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Profile.css";
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API_URL;
const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    branch: "",
    year: "",
    semester: "",
    contact: "",
    profilePic: null,
  });

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `${API}/api/users/me`,
        { withCredentials: true }
      );

      const user = res.data.user;
      setProfileData(user);

      setFormData({
        branch: user.branch || "",
        year: user.year || "",
        semester: user.sem || "",
        contact: user.contact || "",
        profilePic: null,
      });

      // If profile incomplete → open form automatically
      if (!user.branch || !user.contact || !user.year || !user.sem) {
        setEditMode(true);
      }
    } catch (error) {
      console.error(error?.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePic") {
      setFormData({
        ...formData,
        profilePic: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Save profile
  const handleSave = async () => {
    try {
      const data = new FormData();

      data.append("branch", formData.branch);
      data.append("year", formData.year);
      data.append("semester", formData.semester);
      data.append("contact", formData.contact);

      if (formData.profilePic) {
        data.append("profilePic", formData.profilePic);
      }

      await axios.put(
        `${API}/api/users/update-profile`,
        data,
        {
          withCredentials: true,
        }
      );
      toast.success("Profile updated successfully");
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      console.log(error.data || error.message);
      toast.error("Update failed");
    }
  };

  if (!profileData) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div >
      <div className="profile-page">

        <div className="profile-card">

          {/* Top Profile Section */}
          <div className="profile-header">
            <img
              src={
                formData.profilePic
                  ? URL.createObjectURL(formData.profilePic)
                  : profileData.profilePic ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="profile"
              className="profile-img"
            />

            <h2>{profileData.name}</h2>
            <p>{profileData.email}</p>
          </div>

          {/* FORM MODE */}
          {editMode ? (
            <div className="complete-profile">
              <h3>Complete Your Profile</h3>

              <label>Profile Picture</label>
              <input
                type="file"
                name="profilePic"
                onChange={handleChange}
              />

              <label>Studying Branch</label>
              <input
                type="text"
                name="branch"
                placeholder="Computer Engineering"
                value={formData.branch}
                onChange={handleChange}
              />

              <label>Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
              >
                <option value="">Select Year</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </select>

              <label>Semester</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
              >
                <option value="">Select Semester</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
              </select>

              <label>Contact Number</label>
              <input
                type="text"
                name="contact"
                placeholder="9876543210"
                value={formData.contact}
                onChange={handleChange}
                min={10}
              />

              <button onClick={handleSave}>
                Save Profile
              </button>
            </div>
          ) : (
            /* PROFILE VIEW MODE */
            <div className="profile-details">
              <h3>Your Profile</h3>

              <div className="info-box">
                <span>🎓 Branch</span>
                <p>{profileData.branch}</p>
              </div>

              <div className="info-box">
                <span>📅 Year</span>
                <p>{profileData.year}</p>
              </div>

              <div className="info-box">
                <span>📚 Semester</span>
                <p>{profileData.sem}</p>
              </div>

              <div className="info-box">
                <span>📞 Contact</span>
                <p>{profileData.contact}</p>
              </div>

              <button style={{ backgroundColor:"#3B82F6", color: "white", padding: "10px 20px", borderRadius: "10px" }} onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;