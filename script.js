// --- 1. SETUP CONNECTION ---
// Go to Supabase Dashboard -> Settings -> API to get these:
const SUPABASE_URL = "https://tyouigbbbaancfnvzdqy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5b3VpZ2JiYmFhbmNmbnZ6ZHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMzAzNTUsImV4cCI6MjA4NDgwNjM1NX0.AKkSgDWTNWa8sGMGWGCQ7BzEKcY_RxeSnGiBImkVbwo";

// Initialize the client (using the CDN library)
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 2. FETCH PROJECTS (SELECT Query) ---
async function fetchProjects() {
    // SQL Equivalent: SELECT * FROM projects ORDER BY id DESC;
    const { data, error } = await db
        .from('projects')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error("Error loading projects:", error);
    } else {
        const list = document.getElementById('project-list');
        list.innerHTML = ""; // Clear loading text
        
        data.forEach(project => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <span class="tech-tag">${project.tech_stack}</span>
            `;
            list.appendChild(card);
        });
    }
}

// --- 3. SUBMIT FORM (INSERT Query) ---
document.getElementById('guestForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('visitorName').value;
    const msg = document.getElementById('visitorMsg').value;

    // SQL Equivalent: INSERT INTO guestbook (visitor_name, message) VALUES (...)
    const { error } = await db
        .from('guestbook')
        .insert([{ visitor_name: name, message: msg }]);

    if (error) {
        alert("Error saving: " + error.message);
    } else {
        alert("Signed! Refreshing list...");
        fetchMessages(); // Refresh the list
        document.getElementById('guestForm').reset();
    }
});

// --- 4. FETCH MESSAGES (SELECT Query) ---
async function fetchMessages() {
    const { data, error } = await db
        .from('guestbook')
        .select('*')
        .order('visit_time', { ascending: false })
        .limit(5);

    if (error) return console.error(error);

    const ul = document.getElementById('messageList');
    ul.innerHTML = "";
    
    data.forEach(msg => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${msg.visitor_name}</strong>: ${msg.message}
            <small>${new Date(msg.visit_time).toLocaleString()}</small>
        `;
        ul.appendChild(li);
    });
}

// Load data when page opens
fetchProjects();
fetchMessages();