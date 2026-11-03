let tgsResources = document.getElementById('TGSResources');
let tgsrResources = document.getElementById('TGSRResources');
let commands = document.getElementById('commands');
let timedMsg = document.getElementById('timedMsg');
let sidestreamStreamer = document.getElementById('sidestreamStreamer')

function loadNavBar() {
    document.getElementById('mainNav').innerHTML = `
      <td class='panel' width='100%'>
        <table width='100%'>
          <tr>
            <td class="navClick" align='center' width="10%">
              <a href='../index.html'>Home</a>
            </td>
            <td class="navClick" align='center' width="10%">
              <a href='../showResources/index.html'>Resources</a>
            </td>
            <td class="navClick" align='center' width="10%">
              <a href='../tgsnbot/commands.html'>Commands</a>
            </td>
            <td class="navClick" align='center' width="10%">
              <a href='../tgsnbot/timedmsg.html'>Timed Messages</a>
            </td>
            <td class="navClick" align='center' width="10%">
              <a href="#">Releases (WIP)</a>
            </td>
            <td class="navClick" align='center' width="10%">
              <a href="../sidestream/index.html">Sidestream</a>
            </td>
            <td class="navClick" align='center' width="10%">
              <a href="../schedule/builder.html">Schedule Builder</a>
            </td>
            <td class="navClick" align='center' width="10%">
              <a href="https://dashboard.twitch.tv/u/thegamingsaloonnetwork/stream-manager" target="_blank">Twitch
                Dashboard</a>
            </td>
            <td class="navClick" align='center' width="10%">
              <a href="https://studio.youtube.com/channel/UCjsRZM3DrnlTrUP8z6XH5jg" target="_blank">YouTube
                Studio</a>
            </td>
            <td class="navClick" align='center' width="10%">
              <a href="https://tgsnetwork.org" target="_blank">Website</a>
            </td>
          </tr>
        </table>
      </td>`
}

function navigation(role) {
    if (tgsResources || tgsrResources) {
        switch (role) {
            case 'Network Admin':
                tgsResources.innerHTML = `<a href='showResources/index.html'>TGS Resources</a>`;
                tgsrResources.innerHTML = `<a href='showResources/index.html'>TGSR Resources</a>`;
                break;
            default:
                tgsResources.innerHTML = "TGS Resources";
                tgsrResources.innerHTML = "TGSR Resources";
                break;
        }
    }
    if (commands) {
        switch (role) {
            case 'Network Admin':
                commands.innerHTML = `<a href='tgsnbot/commands.html'>Commands</a>`;
                break;
            default:
                commands.innerHTML = 'Commands'
        }
    }
    if (timedMsg) {
        switch (role) {
            case 'Network Admin':
                timedMsg.innerHTML = `<a href='tgsnbot/timedmsg.html'>Current Timed Messages</a>`;
                break;
            default:
                timedMsg.innerHTML = 'Current Timed Messages'
        }
    }
    if (mainNav) {
        switch (role) {
            case 'Network Admin':
                mainNav.style.display = 'table-row';
                break;
            default:
                mainNav.style.display = 'none'
        }
    }
    if (sidestreamStreamer) {
        switch (role) {
            case 'Network Admin':
                sidestreamStreamer.style.display = `table-row`;
                break;
            default:
                sidestreamStreamer.style.display = `none`
        }
    }

}