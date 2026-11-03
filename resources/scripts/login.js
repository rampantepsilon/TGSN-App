window.onload = () => {
    const hashFragment = window.location.hash.slice(1);
    const urlParams = new URLSearchParams(hashFragment);
    let accessToken;
    if (localStorage.getItem('access_token')) {
        accessTokenStr = localStorage.getItem('access_token');
        if (!accessTokenStr) {
            return null;
        }

        if (accessTokenStr) {
            const storedItem = JSON.parse(accessTokenStr);
            const now = new Date().getTime();
            if (parseInt(now) > parseInt(storedItem.expiry)) {
                localStorage.removeItem('access_token');
                return null;
            } else {
                accessToken = storedItem.token;
            }
        } else {
            console.log('Bad Token')
            localStorage.removeItem('access_token');
        }
    } else if (hashFragment) {
        localStorage.removeItem('access_token');
        accessToken = urlParams.get('access_token');
    }

    if (accessToken) {
        document.getElementById('login-btn').style.display = 'none';
        getDiscordUser(accessToken);
        window.history.replaceState({}, document.title, window.location.pathname);
    }
};

function getDiscordUser(token) {
    // Direct API path endpoint target
    fetch('https://discord.com/api/v10/users/@me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => {
            if (!res.ok) throw new Error('Token might be expired or invalid');
            return res.json();
        })
        .then(user => {
            var role = userRole(user.global_name);
            navigation(role);

            document.getElementById('profile-card').style.display = 'block';
            document.getElementById('username').innerText = `${user.global_name}`;
            document.getElementById('role').innerText = `${role}`;

            // Corrected template literals syntax for image rendering
            const avatarBase = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`

            document.getElementById('avatar').src = avatarBase;

            //Set token to local storage if not stored
            if (!localStorage.getItem('access_token')) {
                const item = {
                    token: token,
                    expiry: new Date().getTime() + (6 * 24 * 60 * 60 * 1000) //days * hours * minutes * seconds * milliseconds
                };
                localStorage.setItem('access_token', JSON.stringify(item));
            }
        })
        .catch(err => {
            console.error('CORS or Auth Error:', err);
            document.getElementById('login-btn').style.display = 'inline-block';
        });
}

function logout() {
    localStorage.removeItem('access_token');
    window.location.href = window.location.pathname;
}

function userRole(name) {
    if (name == "RampantEpsilon" || name == 'peacemaker2448') {
        return "Network Admin";
    } else {
        return "User";
    }
}