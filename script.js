// --- Shared Data ---
const teamDetails = {
    "LAL": { name: "Lakers", logo: "https://cdn.nba.com/logos/nba/1610612747/global/L/logo.svg", seed: 1 },
    "NOP": { name: "Pelicans", logo: "https://cdn.nba.com/logos/nba/1610612740/global/L/logo.svg", seed: 8 },
    "GSW": { name: "Warriors", logo: "https://cdn.nba.com/logos/nba/1610612744/global/L/logo.svg", seed: 4 },
    "DEN": { name: "Nuggets", logo: "https://cdn.nba.com/logos/nba/1610612743/global/L/logo.svg", seed: 5 },
    "LAC": { name: "Clippers", logo: "https://cdn.nba.com/logos/nba/1610612746/global/L/logo.svg", seed: 3 },
    "DAL": { name: "Mavericks", logo: "https://cdn.nba.com/logos/nba/1610612742/global/L/logo.svg", seed: 6 },
    "PHX": { name: "Suns", logo: "https://cdn.nba.com/logos/nba/1610612756/global/L/logo.svg", seed: 2 },
    "MEM": { name: "Grizzlies", logo: "https://cdn.nba.com/logos/nba/1610612763/global/L/logo.svg", seed: 7 },
    "BOS": { name: "Celtics", logo: "https://cdn.nba.com/logos/nba/1610612738/global/L/logo.svg", seed: 1 },
    "ATL": { name: "Hawks", logo: "https://cdn.nba.com/logos/nba/1610612737/global/L/logo.svg", seed: 8 },
    "MIL": { name: "Bucks", logo: "https://cdn.nba.com/logos/nba/1610612749/global/L/logo.svg", seed: 4 },
    "MIA": { name: "Heat", logo: "https://cdn.nba.com/logos/nba/1610612748/global/L/logo.svg", seed: 5 },
    "PHI": { name: "76ers", logo: "https://cdn.nba.com/logos/nba/1610612755/global/L/logo.svg", seed: 3 },
    "BKN": { name: "Nets", logo: "https://cdn.nba.com/logos/nba/1610612751/global/L/logo.svg", seed: 6 },
    "CLE": { name: "Cavaliers", logo: "https://cdn.nba.com/logos/nba/1610612739/global/L/logo.svg", seed: 2 },
    "NYK": { name: "Knicks", logo: "https://cdn.nba.com/logos/nba/1610612752/global/L/logo.svg", seed: 7 }
};

const round1Matchups = [
    { id: "W1v8", team1Abbr: "LAL", team2Abbr: "NOP", conference: "Western", matchupNum: 1 },
    { id: "W4v5", team1Abbr: "GSW", team2Abbr: "DEN", conference: "Western", matchupNum: 2 },
    { id: "W3v6", team1Abbr: "LAC", team2Abbr: "DAL", conference: "Western", matchupNum: 3 },
    { id: "W2v7", team1Abbr: "PHX", team2Abbr: "MEM", conference: "Western", matchupNum: 4 },
    { id: "E1v8", team1Abbr: "BOS", team2Abbr: "ATL", conference: "Eastern", matchupNum: 1 },
    { id: "E4v5", team1Abbr: "MIL", team2Abbr: "MIA", conference: "Eastern", matchupNum: 2 },
    { id: "E3v6", team1Abbr: "PHI", team2Abbr: "BKN", conference: "Eastern", matchupNum: 3 },
    { id: "E2v7", team1Abbr: "CLE", team2Abbr: "NYK", conference: "Eastern", matchupNum: 4 }
];

const roundSources = {
    "R2W1": { round: 2, source1: "W1v8", source2: "W4v5", name: "Western Semifinal 1", next: "round2_matchup2W.html", prevRound: "round1Predictions", requiredCount: 8 },
    "R2W2": { round: 2, source1: "W3v6", source2: "W2v7", name: "Western Semifinal 2", next: "round2_matchup1E.html", prevRound: "round1Predictions", requiredCount: 8 },
    "R2E1": { round: 2, source1: "E1v8", source2: "E4v5", name: "Eastern Semifinal 1", next: "round2_matchup2E.html", prevRound: "round1Predictions", requiredCount: 8 },
    "R2E2": { round: 2, source1: "E3v6", source2: "E2v7", name: "Eastern Semifinal 2", next: "round3_matchupW.html", prevRound: "round1Predictions", requiredCount: 8 },
    "R3W": { round: 3, source1: "R2W1", source2: "R2W2", name: "Western Conference Final", next: "round3_matchupE.html", prevRound: "round2Predictions", requiredCount: 4 },
    "R3E": { round: 3, source1: "R2E1", source2: "R2E2", name: "Eastern Conference Final", next: "round4_finals.html", prevRound: "round2Predictions", requiredCount: 4 },
    "R4F": { round: 4, source1: "R3W", source2: "R3E", name: "NBA Finals", next: "predictions.html", prevRound: "round3Predictions", requiredCount: 2 }
};

// --- Helper Function ---
function displayWelcomeMessage(pageType) {
    const username = localStorage.getItem('nbaPlayoffsUsername');
    const header = document.querySelector('.container header');
    const h1 = header?.querySelector('h1');
    if (username && h1) {
        const existingWelcome = header.querySelector('.welcome-message');
        if (!existingWelcome) {
            const welcomeMessage = document.createElement('p');
            welcomeMessage.classList.add('welcome-message');
            welcomeMessage.textContent = `Welcome, ${username}! ${pageType === 'prediction' ? 'Here are your predictions' : 'Click the team you predict to win.'}`;
            welcomeMessage.style.marginTop = '5px';
            welcomeMessage.style.fontSize = '0.9em';
            h1.insertAdjacentElement('afterend', welcomeMessage);
        }
    }
}

// Add click animation to team elements
function addTeamClickAnimation() {
    const teams = document.querySelectorAll('.team');
    teams.forEach(team => {
        team.addEventListener('click', function () {
            // Remove clicked class from all teams
            teams.forEach(t => t.classList.remove('clicked'));
            // Add clicked class to the clicked team
            this.classList.add('clicked');

            // Remove the class after animation completes
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 400); // Match the animation duration
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const usernameInput = document.getElementById('username');
    const username = localStorage.getItem('nbaPlayoffsUsername');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    function handleNewStyleMatchupPage() {
        displayWelcomeMessage('matchup');
        const teamSections = document.querySelectorAll('.team-section');
        const choiceButtons = document.querySelectorAll('.choice-button');
        let matchupId = null;
        let round = 0;
        let storageKey = '';
        let storedPredictions = {};

        // Determine Round and Matchup ID
        if (currentPage.startsWith('matchup')) {
            round = 1;
            storageKey = 'round1Predictions';
            const r1Match = currentPage.match(/matchup(\d+)([WE])\.html/);
            if (r1Match) {
                const num = parseInt(r1Match[1]);
                const conf = r1Match[2];
                const r1MatchupData = round1Matchups.find(m => m.matchupNum === num && m.conference.startsWith(conf));
                if (r1MatchupData) matchupId = r1MatchupData.id;
            }
        } else if (currentPage.startsWith('round2_') || currentPage.startsWith('round3_') || currentPage.startsWith('round4_')) {
            round = parseInt(currentPage.charAt(5));
            storageKey = `round${round}Predictions`;
            if (currentPage.startsWith('round3_')) {
                const conf = currentPage.includes('matchupW') ? 'W' : 'E';
                matchupId = `R3${conf}`;
            } else if (currentPage.startsWith('round4_')) {
                matchupId = 'R4F';
            } else {
                const roundMatch = currentPage.match(/round(\d+)_matchup(\d+)([WE])/);
                if (roundMatch) {
                    const roundNum = roundMatch[1];
                    const matchupNum = roundMatch[2];
                    const conf = roundMatch[3];
                    matchupId = `R${roundNum}${conf}${matchupNum}`;
                }
            }
        }

        console.log('Current Page:', currentPage);
        console.log('Round:', round);
        console.log('Matchup ID:', matchupId);
        console.log('Storage Key:', storageKey);

        if (!matchupId) {
            console.error("Could not determine matchup ID for page:", currentPage);
            return;
        }

        storedPredictions = JSON.parse(localStorage.getItem(storageKey) || '{}');
        console.log('Stored Predictions for current round:', storedPredictions);

        // --- Populate Backgrounds and Buttons ---
        let team1Abbr, team2Abbr;
        if (round === 1) {
            const r1Data = round1Matchups.find(m => m.id === matchupId);
            if (r1Data) {
                team1Abbr = r1Data.team1Abbr;
                team2Abbr = r1Data.team2Abbr;
            }
        } else {
            const sourceData = roundSources[matchupId];
            if (sourceData) {
                const prevRoundPredictions = JSON.parse(localStorage.getItem(sourceData.prevRound) || '{}');
                console.log('Previous Round Predictions:', prevRoundPredictions);
                console.log('Source Data:', sourceData);

                if (Object.keys(prevRoundPredictions).length < sourceData.requiredCount) {
                    console.error(`Incomplete previous round. Required: ${sourceData.requiredCount}, Got: ${Object.keys(prevRoundPredictions).length}`);
                    alert(`Please complete Round ${sourceData.round - 1} predictions first!`);
                    window.location.href = 'index.html';
                    return;
                }
                team1Abbr = prevRoundPredictions[sourceData.source1];
                team2Abbr = prevRoundPredictions[sourceData.source2];
                console.log('Teams from previous round:', { team1Abbr, team2Abbr });
            }
        }

        if (team1Abbr && team2Abbr && teamDetails[team1Abbr] && teamDetails[team2Abbr] && teamSections.length === 2 && choiceButtons.length === 2) {
            teamSections[0].style.backgroundImage = `url(${teamDetails[team1Abbr].logo})`;
            teamSections[0].setAttribute('data-team-abbr', team1Abbr);
            choiceButtons[0].textContent = `${team1Abbr} (${teamDetails[team1Abbr].seed})`;
            choiceButtons[0].setAttribute('data-team-abbr', team1Abbr);

            teamSections[1].style.backgroundImage = `url(${teamDetails[team2Abbr].logo})`;
            teamSections[1].setAttribute('data-team-abbr', team2Abbr);
            choiceButtons[1].textContent = `${team2Abbr} (${teamDetails[team2Abbr].seed})`;
            choiceButtons[1].setAttribute('data-team-abbr', team2Abbr);

            if (storedPredictions[matchupId]) {
                teamSections.forEach(section => {
                    const sectionAbbr = section.getAttribute('data-team-abbr');
                    section.classList.toggle('selected', sectionAbbr === storedPredictions[matchupId]);
                    section.classList.toggle('not-selected', sectionAbbr !== storedPredictions[matchupId]);
                });
            }
        } else {
            console.error("Failed to get team data or elements for matchup:", matchupId);
            return;
        }

        // --- Event Listener for Selection ---
        choiceButtons.forEach(button => {
            button.addEventListener('click', () => {
                const selectedTeamAbbr = button.getAttribute('data-team-abbr');
                teamSections.forEach(section => {
                    const sectionAbbr = section.getAttribute('data-team-abbr');
                    section.classList.remove('selected', 'not-selected');
                    if (sectionAbbr === selectedTeamAbbr) {
                        section.classList.add('selected');
                    } else {
                        section.classList.add('not-selected');
                    }
                });
                storedPredictions[matchupId] = selectedTeamAbbr;
                localStorage.setItem(storageKey, JSON.stringify(storedPredictions));
                console.log('Updated predictions after selection:', JSON.parse(localStorage.getItem(storageKey)));

                // Navigate to next page after selection
                let nextUrl = 'predictions.html'; // Default
                if (round === 1) {
                    const match = currentPage.match(/matchup(\d+)([WE])\.html/);
                    if (match) {
                        let currentNum = parseInt(match[1]);
                        let currentConf = match[2];
                        if (currentConf === 'W') {
                            nextUrl = (currentNum < 4) ? `matchup${currentNum + 1}W.html` : 'matchup1E.html';
                        } else {
                            nextUrl = (currentNum < 4) ? `matchup${currentNum + 1}E.html` : 'round2_matchup1W.html';
                        }
                    }
                } else if (round >= 2 && round <= 4) {
                    if (roundSources[matchupId]) {
                        nextUrl = roundSources[matchupId].next;
                    }
                }
                window.location.href = nextUrl;
            });
        });
    }


    // --- Page Routing ---
    if (currentPage === 'index.html') {
        // Logic for Login Page
        const loginButton = document.getElementById('loginButton'); // Get button specifically for this page
        const usernameInput = document.getElementById('username'); // Get input specifically for this page
        if (loginButton && usernameInput) {
            loginButton.addEventListener('click', () => {
                const usernameValue = usernameInput.value.trim();
                if (usernameValue) {
                    localStorage.setItem('nbaPlayoffsUsername', usernameValue);
                    localStorage.removeItem('round1Predictions');
                    localStorage.removeItem('round2Predictions');
                    localStorage.removeItem('round3Predictions');
                    localStorage.removeItem('round4Predictions');
                    window.location.href = 'matchup1W.html';
                } else {
                    alert('Please enter your user name.');
                    usernameInput.focus();
                }
            });
            usernameInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    loginButton.click();
                }
            });
        }
    } else if (currentPage === 'predictions.html') {
        // Logic for Predictions Page
        displayWelcomeMessage('prediction');
        const predictionsSummaryDiv = document.getElementById('predictions-summary');
        const bracketDisplayDiv = document.getElementById('bracket-display');

        if (predictionsSummaryDiv && bracketDisplayDiv) {
            const storedR1 = JSON.parse(localStorage.getItem('round1Predictions') || '{}');
            const storedR2 = JSON.parse(localStorage.getItem('round2Predictions') || '{}');
            const storedR3 = JSON.parse(localStorage.getItem('round3Predictions') || '{}');
            const storedR4 = JSON.parse(localStorage.getItem('round4Predictions') || '{}');

            const r1Complete = Object.keys(storedR1).length === 8;
            const r2Complete = Object.keys(storedR2).length === 4;
            const r3Complete = Object.keys(storedR3).length === 2;
            const r4Complete = Object.keys(storedR4).length === 1;
            const allComplete = r1Complete && r2Complete && r3Complete && r4Complete;

            if (allComplete) {
                // --- Generate Visual Bracket ---
                const pageTitle = document.querySelector('.container header h1');
                if (pageTitle) pageTitle.textContent = 'Your Final Predictions';

                predictionsSummaryDiv.classList.add('hidden');
                bracketDisplayDiv.style.display = 'flex';

                const getTeam = (roundStore, matchupId) => {
                    const winnerAbbr = roundStore[matchupId];
                    if (winnerAbbr && teamDetails[winnerAbbr]) {
                        return { abbr: winnerAbbr, ...teamDetails[winnerAbbr] };
                    }
                    return { abbr: 'TBD', name: 'TBD', logo: 'placeholder.png', seed: '?' };
                };

                const r1Winners = {
                    W1v8: getTeam(storedR1, "W1v8"), W4v5: getTeam(storedR1, "W4v5"),
                    W3v6: getTeam(storedR1, "W3v6"), W2v7: getTeam(storedR1, "W2v7"),
                    E1v8: getTeam(storedR1, "E1v8"), E4v5: getTeam(storedR1, "E4v5"),
                    E3v6: getTeam(storedR1, "E3v6"), E2v7: getTeam(storedR1, "E2v7")
                };
                const r2Winners = {
                    R2W1: getTeam(storedR2, "R2W1"), R2W2: getTeam(storedR2, "R2W2"),
                    R2E1: getTeam(storedR2, "R2E1"), R2E2: getTeam(storedR2, "R2E2")
                };
                const r3Winners = { R3W: getTeam(storedR3, "R3W"), R3E: getTeam(storedR3, "R3E") };
                const champion = getTeam(storedR4, "R4F");

                const createTeamHTML = (teamData, isWinner = false) => `
                    <div class="bracket-team ${isWinner ? 'winner' : ''}">
                        <img src="${teamData.logo}" alt="${teamData.name}">
                        <span>(${teamData.seed}) ${teamData.abbr}</span>
                    </div>`;

                const createMatchupHTML = (team1, team2, winnerAbbr) => `
                    <div class="bracket-matchup">
                        ${createTeamHTML(team1, team1.abbr === winnerAbbr)}
                        ${createTeamHTML(team2, team2.abbr === winnerAbbr)}
                    </div>`;

                bracketDisplayDiv.innerHTML = `
                    <h2>Your Predicted Bracket</h2>
                    <div class="bracket-region"> <!-- West -->
                        <div class="bracket-round"> <!-- R1 West -->
                            ${createMatchupHTML(teamDetails['LAL'], teamDetails['NOP'], r1Winners['W1v8'].abbr)}
                            ${createMatchupHTML(teamDetails['GSW'], teamDetails['DEN'], r1Winners['W4v5'].abbr)}
                            ${createMatchHTML(teamDetails['LAC'], teamDetails['DAL'], r1Winners['W3v6'].abbr)}
                            ${createMatchupHTML(teamDetails['PHX'], teamDetails['MEM'], r1Winners['W2v7'].abbr)}
                        </div>
                        <div class="bracket-round"> <!-- R2 West -->
                             ${createMatchupHTML(r1Winners['W1v8'], r1Winners['W4v5'], r2Winners['R2W1'].abbr)}
                             ${createMatchupHTML(r1Winners['W3v6'], r1Winners['W2v7'], r2Winners['R2W2'].abbr)}
                        </div>
                        <div class="bracket-round"> <!-- R3 West -->
                             ${createMatchupHTML(r2Winners['R2W1'], r2Winners['R2W2'], r3Winners['R3W'].abbr)}
                        </div>
                    </div>
                    <div class="bracket-final-region"> <!-- Finals -->
                         <div class="bracket-champion">
                              <img src="${champion.logo}" alt="${champion.name}">
                              <span>${champion.abbr}</span>
                              <div class="title">CHAMPION</div>
                         </div>
                    </div>
                    <div class="bracket-region"> <!-- East -->
                         <div class="bracket-round"> <!-- R3 East -->
                              ${createMatchupHTML(r2Winners['R2E1'], r2Winners['R2E2'], r3Winners['R3E'].abbr)}
                         </div>
                         <div class="bracket-round"> <!-- R2 East -->
                              ${createMatchHTML(r1Winners['E1v8'], r1Winners['E4v5'], r2Winners['R2E1'].abbr)}
                              ${createMatchHTML(r1Winners['E3v6'], r1Winners['E2v7'], r2Winners['R2E2'].abbr)}
                         </div>
                         <div class="bracket-round"> <!-- R1 East -->
                            ${createMatchupHTML(teamDetails['BOS'], teamDetails['ATL'], r1Winners['E1v8'].abbr)}
                            ${createMatchHTML(teamDetails['MIL'], teamDetails['MIA'], r1Winners['E4v5'].abbr)}
                            ${createMatchHTML(teamDetails['PHI'], teamDetails['BKN'], r1Winners['E3v6'].abbr)}
                            ${createMatchupHTML(teamDetails['CLE'], teamDetails['NYK'], r1Winners['E2v7'].abbr)}
                        </div>
                    </div>
                 `;
            } else {
                // --- Show Text Summary ---
                bracketDisplayDiv.style.display = 'none';
                predictionsSummaryDiv.classList.remove('hidden');

                let predictionsHTML = '<h2>Round 1 Picks:</h2>';
                if (r1Complete) {
                    round1Matchups.forEach(r1m => {
                        const winnerAbbr = storedR1[r1m.id];
                        const winnerName = winnerAbbr && teamDetails[winnerAbbr] ? teamDetails[winnerAbbr].name : '(Not selected)';
                        predictionsHTML += `<p>${r1m.conference} Matchup ${r1m.matchupNum}: ${winnerName} wins</p>`;
                    });
                } else {
                    predictionsHTML += '<p>Round 1 predictions incomplete.</p>';
                }

                predictionsHTML += '<h2 style="margin-top: 30px;">Round 2 Picks:</h2>';
                if (r2Complete) {
                    ["R2W1", "R2W2", "R2E1", "R2E2"].forEach(r2Id => {
                        const winnerAbbr = storedR2[r2Id];
                        const winnerName = winnerAbbr && teamDetails[winnerAbbr] ? teamDetails[winnerAbbr].name : '(Not selected)';
                        predictionsHTML += `<p>${roundSources[r2Id].name}: ${winnerName} wins</p>`;
                    });
                } else {
                    predictionsHTML += `<p>Round 2 predictions ${r1Complete ? 'incomplete or not started' : 'cannot start until Round 1 is complete'}.</p>`;
                }

                predictionsHTML += '<h2 style="margin-top: 30px;">Round 3 Picks (Conference Finals):</h2>';
                if (r3Complete) {
                    ["R3W", "R3E"].forEach(r3Id => {
                        const winnerAbbr = storedR3[r3Id];
                        const winnerName = winnerAbbr && teamDetails[winnerAbbr] ? teamDetails[winnerAbbr].name : '(Not selected)';
                        predictionsHTML += `<p>${roundSources[r3Id].name}: ${winnerName} wins</p>`;
                    });
                } else {
                    predictionsHTML += `<p>Round 3 predictions ${r2Complete ? 'incomplete or not started' : 'cannot start until Round 2 is complete'}.</p>`;
                }

                predictionsHTML += '<h2 style="margin-top: 30px;">Round 4 Pick (NBA Finals):</h2>';
                if (r4Complete) {
                    const winnerAbbr = storedR4["R4F"];
                    const winnerName = winnerAbbr && teamDetails[winnerAbbr] ? teamDetails[winnerAbbr].name : '(Not selected)';
                    predictionsHTML += `<p>NBA Champion: ${winnerName}</p>`;
                } else {
                    predictionsHTML += `<p>NBA Finals prediction ${r3Complete ? 'incomplete or not started' : 'cannot start until Round 3 is complete'}.</p>`;
                }

                predictionsSummaryDiv.innerHTML = predictionsHTML;
            }
        }
    }
    // Apply new style logic if on a matchup page
    else if (document.querySelector('.matchup-page.new-style')) {
        handleNewStyleMatchupPage();
    }

    // Add this line to initialize click animations
    addTeamClickAnimation();
});

