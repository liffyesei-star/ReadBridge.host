// mock-users.js
// Centralized mock data for users

function generateStructuredID(seedText) {
    // Generate a pseudo-random but consistent ID based on username seed
    let hash = 0;
    for (let i = 0; i < seedText.length; i++) {
        hash = seedText.charCodeAt(i) + ((hash << 5) - hash);
    }
    const absHash = Math.abs(hash).toString().padStart(6, '0').substring(0, 6);
    return `RB-${absHash}`;
}

const rawMockUsers = [
    { username: '@budis', name: 'Budi Santoso', avatar: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=f59e0b&color=fff', online: true },
    { username: '@dewilest', name: 'Dewi Lestari', avatar: 'https://ui-avatars.com/api/?name=Dewi+Lestari&background=ec4899&color=fff', online: true },
    { username: '@sarahj', name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', online: true },
    { username: '@mchen99', name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', online: false },
    { username: '@AhmadFauzi', name: 'Ahmad Fauzi', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', online: true },
    { username: '@SitiAminah', name: 'Siti Aminah', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026703d', online: false },
    { username: '@JokoWidodo', name: 'Joko Widodo', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026705d', online: false },
    { username: '@RinaSari', name: 'Rina Sari', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', online: false },
    // Duplicate test case
    { username: '@budis', name: 'Budi Setiawan', avatar: 'https://ui-avatars.com/api/?name=Budi+Setiawan&background=3b82f6&color=fff', online: false }
];

function initializeMockUsers() {
    const processedUsers = [];
    const usernameMap = {};

    rawMockUsers.forEach(u => {
        let finalUsername = u.username.toLowerCase();
        
        // Handle duplicate username logic by appending numbers
        if (usernameMap[finalUsername]) {
            let count = 1;
            while (usernameMap[finalUsername + count]) {
                count++;
            }
            finalUsername = finalUsername + count;
        }
        
        usernameMap[finalUsername] = true;

        processedUsers.push({
            id: generateStructuredID(finalUsername),
            username: finalUsername,
            name: u.name,
            avatar: u.avatar,
            online: u.online
        });
    });

    window.ALL_USERS = processedUsers;
}

// Validation function exposed globally
window.isUsernameTaken = function(newUsername) {
    const formatted = newUsername.startsWith('@') ? newUsername.toLowerCase() : '@' + newUsername.toLowerCase();
    
    // Check dummy users
    if (window.ALL_USERS && window.ALL_USERS.some(u => u.username === formatted)) {
        return true;
    }
    
    // Check local storage for the CURRENT user
    const currentUsername = localStorage.getItem('rb_username');
    if (currentUsername && currentUsername.toLowerCase() === formatted) {
        return false; // Can't be taken by yourself
    }

    return false;
};

// Initialize immediately
initializeMockUsers();
