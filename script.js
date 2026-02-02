// --- 1. SETUP CONNECTION ---
// Go to Supabase Dashboard -> Settings -> API to get these:
const SUPABASE_URL = "https://tyouigbbbaancfnvzdqy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5b3VpZ2JiYmFhbmNmbnZ6ZHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMzAzNTUsImV4cCI6MjA4NDgwNjM1NX0.AKkSgDWTNWa8sGMGWGCQ7BzEKcY_RxeSnGiBImkVbwo";

// Initialize the client (using the CDN library)
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);


// --- 2. FETCH PROJECTS (Updated for Clickable Links) ---
async function fetchProjects() {
    const { data, error } = await db
        .from('projects')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error("Error loading projects:", error);
    } else {
        const list = document.getElementById('project-list');
        list.innerHTML = ""; 
        
        data.forEach(project => {
            // We create an Anchor <a> tag instead of a div so the whole card is clickable
            const card = document.createElement('a');
            card.className = 'card';
            // Use the database URL, or fallback to GitHub profile if missing
            card.href = project.github_url || "https://github.com/shashwat-158";
            card.target = "_blank"; // Open in new tab
            
            card.innerHTML = `
                <div class="card-content">
                    <h3>${project.title}</h3>
                    <span class="tech-tag">${project.tech_stack}</span>
                </div>
                <div class="card-overlay">
                    <p>${project.description}</p>
                    <small style="margin-top:10px; font-weight:bold;">Click to view code ↗</small>
                </div>
            `;
            list.appendChild(card);
        });
    }
}

// --- 3. SUBMIT FORM (Updated: Insert Only, No Refresh) ---
document.getElementById('guestForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('visitorName').value;
    const msg = document.getElementById('visitorMsg').value;

    const { error } = await db
        .from('guestbook') // You can keep the table name 'guestbook' even if UI says 'Contact'
        .insert([{ visitor_name: name, message: msg }]);

    if (error) {
        alert("Error sending message: " + error.message);
    } else {
        alert("Message sent securely to the database! I will get back to you soon.");
        document.getElementById('guestForm').reset();
    }
});

// Load ONLY projects when page opens (No fetchMessages)
fetchProjects();