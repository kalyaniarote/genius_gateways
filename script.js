async function fetchPosts() {
    try {
        const response = await fetch("http://localhost:5000/api/posts");
        const posts = await response.json();

        if (!posts || posts.length === 0) {
            document.getElementById("postsContainer").innerHTML = "<p>No posts available.</p>";
            return;
        }

        const postsContainer = document.getElementById("postsContainer");
        postsContainer.innerHTML = ""; // Clear previous posts

        posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("post-card");
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <img src="http://localhost:5000${post.image}" width="300" alt="${post.title}" onerror="this.onerror=null; this.src='fallback.jpg';">
            `;

            // Show delete button ONLY for admin
            if (window.location.pathname.includes("admin.html")) {
                postElement.innerHTML += `<br><button onclick="deletePost('${post.title}')">Delete Post</button>`;
            }

            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        document.getElementById("postsContainer").innerHTML = "<p>Error loading posts.</p>";
    }
}

// Function to delete a post (Admin Only)
async function deletePost(title) {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
        try {
            const response = await fetch(`http://localhost:5000/api/delete/${encodeURIComponent(title)}`, {
                method: "DELETE"
            });

            const result = await response.json();
            alert(result.message);
            fetchPosts(); // Reload posts after deletion
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post. Please try again.");
        }
    }
}

// Function to scroll left
function scrollLeft() {
    document.getElementById("postsContainer").scrollBy({ left: -300, behavior: "smooth" });
}

// Function to scroll right
function scrollRight() {
    document.getElementById("postsContainer").scrollBy({ left: 300, behavior: "smooth" });
}

// Load posts on page load
fetchPosts();
