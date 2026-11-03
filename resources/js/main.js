// Initialize the Neutralino application
Neutralino.init();

async function initTray() {
    // Set up the tray menu options
    let tray = {
        icon: '/resources/images/tgsn.jpg', // Ensure this image path is correct
        menuItems: [
            { id: "toggle", text: "Open App" },
            { id: "minToTray", text: "Minimize to Tray" },
            { id: "sep", text: "-" },
            { id: "quit", text: "Quit App" }
        ]
    };

    await Neutralino.os.setTray(tray);
}

// Handle menu item interactions
Neutralino.events.on('trayMenuItemClicked', async (event) => {
    const menuItemId = event.detail.id;

    if (menuItemId === 'toggle') {
        let isVisible = await Neutralino.window.isVisible();
        if (isVisible) {
            return;
        } else {
            // Optional: Position the window near the cursor or tray coordinates before showing
            await Neutralino.window.show();
            await Neutralino.window.focus();
        }
    } else if (menuItemId === 'minToTray') {
        const choice = await Neutralino.os.showMessageBox(
            "Minimize To Tray",
            "Do you want to minimize the app instead of closing?",
            "YES_NO",
            "QUESTION"
        );

        if (choice === "YES") {
            await Neutralino.storage.setData("skipMinimizeConfirmation", "true");
        }
        if (choice === 'NO') {
            await Neutralino.storage.clear();
        }
    }
    else if (menuItemId === 'quit') {
        await Neutralino.storage.clear();
        await Neutralino.app.exit();
    }
});

Neutralino.events.on('windowClose', async (event) => {
    // Ask user if they want to minimize to tray
    try {
        //Check if remember Minimize option is set
        let skipMinimizeConfirmation = false;
        try {
            const storedVal = await Neutralino.storage.getData("skipMinimizeConfirmation");
            skipMinimizeConfirmation = (storedVal === "true");
        } catch (e) {
            // Key doesn't exist yet in storage; safe to ignore
        }

        // Minimize to tray if option is set
        if (skipMinimizeConfirmation) {
            await Neutralino.window.hide();
            return;
        }

        else {
            await Neutralino.app.exit();
        }
    } catch (err) {
        console.error("Error showing close dialog:", err);
    }
})
// Initialize the tray on start
initTray();