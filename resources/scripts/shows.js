let showPanel = document.getElementById('currentShow');

function showStream() {
    const today = new Date();
    const dayIndex = today.getDay();
    switch (dayIndex) {
        case 0:
            showPanel.innerHTML = "The Gaming Saloon / The Gaming Saloon Reviews";
            break;
        case 1:
            showPanel.innerHTML = "None";
            break;
        case 2:
            showPanel.innerHTML = "None";
            break;
        case 3:
            showPanel.innerHTML = "None";
            break;
        case 4:
            showPanel.innerHTML = "Peace Plays / Peace Makes";
            break;
        case 5:
            showPanel.innerHTML = "Tales From The Cube / Across The Cubiverse";
            break;
        case 6:
            showPanel.innerHTML = "Rampant Gaming";
            break;
    }
}