// --- Shared Data ---
const teamDetails = {
    "OKC": { name: "Thunder", logo: "https://cdn.nba.com/logos/nba/1610612760/global/L/logo.svg", seed: 1, conference: 'Western' },
    "MIN": { name: "Timberwolves", logo: "https://cdn.nba.com/logos/nba/1610612750/global/L/logo.svg", seed: 8, conference: 'Western' },
    "DEN": { name: "Nuggets", logo: "https://cdn.nba.com/logos/nba/1610612743/global/L/logo.svg", seed: 4, conference: 'Western' },
    "LAC": { name: "Clippers", logo: "https://cdn.nba.com/logos/nba/1610612746/global/L/logo.svg", seed: 5, conference: 'Western' },
    "LAL": { name: "Lakers", logo: "https://cdn.nba.com/logos/nba/1610612747/global/L/logo.svg", seed: 3, conference: 'Western' },
    "GSW": { name: "Warriors", logo: "https://cdn.nba.com/logos/nba/1610612744/global/L/logo.svg", seed: 6, conference: 'Western' },
    "HOU": { name: "Rockets", logo: "https://cdn.nba.com/logos/nba/1610612745/global/L/logo.svg", seed: 2, conference: 'Western' },
    "MEM": { name: "Grizzlies", logo: "https://cdn.nba.com/logos/nba/1610612763/global/L/logo.svg", seed: 7, conference: 'Western' },
    "CLE": { name: "Cavaliers", logo: "https://cdn.nba.com/logos/nba/1610612739/global/L/logo.svg", seed: 1, conference: 'Eastern' },
    "ATL": { name: "Hawks", logo: "https://cdn.nba.com/logos/nba/1610612737/global/L/logo.svg", seed: 8, conference: 'Eastern' },
    "IND": { name: "Pacers", logo: "https://cdn.nba.com/logos/nba/1610612754/global/L/logo.svg", seed: 4, conference: 'Eastern' },
    "MIL": { name: "Bucks", logo: "https://cdn.nba.com/logos/nba/1610612749/global/L/logo.svg", seed: 5, conference: 'Eastern' },
    "NYK": { name: "Knicks", logo: "https://cdn.nba.com/logos/nba/1610612752/global/L/logo.svg", seed: 3, conference: 'Eastern' },
    "DET": { name: "Pistons", logo: "https://cdn.nba.com/logos/nba/1610612765/global/L/logo.svg", seed: 6, conference: 'Eastern' },
    "BOS": { name: "Celtics", logo: "https://cdn.nba.com/logos/nba/1610612738/global/L/logo.svg", seed: 2, conference: 'Eastern' },
    "ORL": { name: "Magic", logo: "https://cdn.nba.com/logos/nba/1610612753/global/L/logo.svg", seed: 7, conference: 'Eastern' }
};

const round1Matchups = [
    { id: "W1v8", team1Abbr: "OKC", team2Abbr: "MIN", conference: "Western", matchupNum: 1 },
    { id: "W4v5", team1Abbr: "DEN", team2Abbr: "LAC", conference: "Western", matchupNum: 2 },
    { id: "W3v6", team1Abbr: "LAL", team2Abbr: "GSW", conference: "Western", matchupNum: 3 },
    { id: "W2v7", team1Abbr: "HOU", team2Abbr: "MEM", conference: "Western", matchupNum: 4 },
    { id: "E1v8", team1Abbr: "CLE", team2Abbr: "ATL", conference: "Eastern", matchupNum: 1 },
    { id: "E4v5", team1Abbr: "IND", team2Abbr: "MIL", conference: "Eastern", matchupNum: 2 },
    { id: "E3v6", team1Abbr: "NYK", team2Abbr: "DET", conference: "Eastern", matchupNum: 3 },
    { id: "E2v7", team1Abbr: "BOS", team2Abbr: "ORL", conference: "Eastern", matchupNum: 4 }
];

const roundSources = {
    "R2W1": { round: 2, source1: "W1v8", source2: "W4v5", name: "Western Semifinal 1", next: "round2_matchup2W.html", prevRound: "round1Predictions", requiredCount: 8 },
    "R2W2": { round: 2, source1: "W3v6", source2: "W2v7", name: "Western Semifinal 2", next: "round2_matchup1E.html", prevRound: "round1Predictions", requiredCount: 8 },
    "R2E1": { round: 2, source1: "E1v8", source2: "E4v5", name: "Eastern Semifinal 1", next: "round2_matchup2E.html", prevRound: "round1Predictions", requiredCount: 8 },
    "R2E2": { round: 2, source1: "E3v6", source2: "E2v7", name: "Eastern Semifinal 2", next: "round3_matchupE.html", prevRound: "round1Predictions", requiredCount: 8 },
    "R3E": { round: 3, source1: "R2E1", source2: "R2E2", name: "Eastern Conference Final", next: "round3_matchupW.html", prevRound: "round2Predictions", requiredCount: 4 },
    "R3W": { round: 3, source1: "R2W1", source2: "R2W2", name: "Western Conference Final", next: "round4_finals.html", prevRound: "round2Predictions", requiredCount: 4 },
    "R4F": { round: 4, source1: "R3W", source2: "R3E", name: "NBA Finals", next: "predictions.html", prevRound: "round3Predictions", requiredCount: 2 }
};

// --- Helper Function ---
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = ''; // Clear the element
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

function displayWelcomeMessage(pageType) {
    const username = localStorage.getItem('nbaPlayoffsUsername');
    const header = document.querySelector('.container header');
    const h1 = header?.querySelector('h1');
    if (username && h1) {
        const existingWelcome = header.querySelector('.welcome-message');
        if (!existingWelcome) {
            const welcomeMessage = document.createElement('p');
            welcomeMessage.classList.add('welcome-message');
            welcomeMessage.style.marginTop = '5px';
            welcomeMessage.style.fontSize = '0.9em';
            h1.insertAdjacentElement('afterend', welcomeMessage);

            const messageText = `Welcome, ${username}! ${pageType === 'prediction' ? 'Here are your predictions' : 'Click the team you predict to win.'}`;
            typeWriter(welcomeMessage, messageText);
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

async function savePrediction(matchupId, selectedTeamAbbr, storageKey) {
    try {
        const username = localStorage.getItem('nbaPlayoffsUsername');
        console.log(`[DEBUG] 保存预测: ${matchupId}, ${selectedTeamAbbr}, 用户: ${username}`);

        // 格式化时间戳
        const now = new Date();
        const timestamp = now.toISOString().split('.')[0];
        console.log(`[DEBUG] 时间戳: ${timestamp}`);

        const prediction = {
            username: username || 'guest', // 确保总是有用户名
            matchup_id: matchupId,
            selected_team: selectedTeamAbbr,
            timestamp: timestamp
        };
        console.log(`[DEBUG] 预测数据:`, prediction);

        // 先更新本地存储
        let storedPredictions = JSON.parse(localStorage.getItem(storageKey) || '{}');
        storedPredictions[matchupId] = selectedTeamAbbr;
        localStorage.setItem(storageKey, JSON.stringify(storedPredictions));
        console.log(`[DEBUG] 本地存储已更新:`, storedPredictions);

        // 尝试发送API请求
        console.log(`[DEBUG] 正在发送API请求...`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

        const response = await fetch('https://two025nbagames-1.onrender.com/predictions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(prediction),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        console.log(`[DEBUG] API响应状态: ${response.status}`);

        // 获取并记录完整响应内容
        const responseText = await response.text();
        console.log(`[DEBUG] API响应内容: ${responseText}`);

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status} - ${responseText}`);
        }

        console.log(`[DEBUG] ${matchupId}预测成功保存到API`);
        return true;

    } catch (error) {
        console.error(`[ERROR] 保存预测失败: ${error.message}`);
        console.log(`[DEBUG] 尝试重新发送请求...`);

        // 重试一次
        try {
            const username = localStorage.getItem('nbaPlayoffsUsername') || 'guest';
            const now = new Date();
            const timestamp = now.toISOString().split('.')[0];

            const prediction = {
                username: username,
                matchup_id: matchupId,
                selected_team: selectedTeamAbbr,
                timestamp: timestamp
            };

            console.log(`[DEBUG] 重试发送数据:`, prediction);

            // 直接使用fetch并等待响应
            const retryResponse = await fetch('https://two025nbagames-1.onrender.com/predictions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(prediction)
            });

            console.log(`[DEBUG] 重试响应状态: ${retryResponse.status}`);
            const retryResponseText = await retryResponse.text();
            console.log(`[DEBUG] 重试响应内容: ${retryResponseText}`);

            if (retryResponse.ok) {
                console.log(`[DEBUG] 重试成功: ${matchupId}已保存`);
                return true;
            } else {
                console.error(`[ERROR] 重试请求失败: ${retryResponse.status}`);
            }
        } catch (retryError) {
            console.error(`[ERROR] 重试也失败了: ${retryError.message}`);
        }

        // 即使失败也确保本地存储已更新
        let storedPredictions = JSON.parse(localStorage.getItem(storageKey) || '{}');
        storedPredictions[matchupId] = selectedTeamAbbr;
        localStorage.setItem(storageKey, JSON.stringify(storedPredictions));
        console.log(`[DEBUG] 确保本地存储已更新:`, storedPredictions);
        return false;
    }
}

// 修改現有的 handleTeamClick 函數
async function handleTeamClick(event) {
    // ... existing code ...

    // 在選擇團隊後保存預測
    await savePrediction(matchupId, selectedTeamAbbr, storageKey);

    // ... existing code ...
}

// Add the document ready event listener
document.addEventListener('DOMContentLoaded', function () {
    console.log('頁面加載完成，初始化...');
    const loginButton = document.getElementById('loginButton');
    const usernameInput = document.getElementById('username');
    const username = localStorage.getItem('nbaPlayoffsUsername');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log('當前頁面:', currentPage);

    // 初始化對戰頁面，更新統計數據和顯示
    function initMatchupPage() {
        console.log('初始化對戰頁面');

        // 獲取左右隊伍元素
        const leftTeam = document.querySelector('.left-team');
        const rightTeam = document.querySelector('.right-team');
        const statsContainer = document.querySelector('.stats-container');

        if (!leftTeam || !rightTeam) {
            console.error('找不到隊伍元素');
            return;
        }

        if (!statsContainer) {
            console.error('找不到統計容器');
            return;
        }

        // 獲取隊伍縮寫
        const leftTeamAbbr = leftTeam.getAttribute('data-team');
        const rightTeamAbbr = rightTeam.getAttribute('data-team');

        if (!leftTeamAbbr || !rightTeamAbbr) {
            console.error('無法獲取隊伍縮寫');
            return;
        }

        console.log(`頁面加載：對戰${leftTeamAbbr} vs ${rightTeamAbbr}`);

        // 更新隊伍信息顯示
        updateTeamDisplay(leftTeam, leftTeamAbbr);
        updateTeamDisplay(rightTeam, rightTeamAbbr);

        // 更新統計數據
        updateMatchupStats(leftTeamAbbr, rightTeamAbbr);

        // 更新長條圖顏色
        updateBarColors(leftTeamAbbr, rightTeamAbbr);
    }

    /**
     * 更新隊伍顯示
     * @param {HTMLElement} teamElement - 隊伍元素
     * @param {string} teamAbbr - 隊伍縮寫
     */
    function updateTeamDisplay(teamElement, teamAbbr) {
        if (!teamElement || !teamAbbr || !teamDetails[teamAbbr]) {
            console.error('無法更新隊伍顯示:', teamAbbr);
            return;
        }

        // 設置隊名和種子
        const teamNameElement = teamElement.querySelector('span');
        if (teamNameElement) {
            teamNameElement.textContent = `${teamAbbr} (${teamDetails[teamAbbr].seed})`;
        }

        // 設置標誌
        const logoElement = teamElement.querySelector('.team-logo-bg');
        if (logoElement) {
            logoElement.style.backgroundImage = `url(${teamDetails[teamAbbr].logo})`;
        }
    }

    // 如果是對戰頁面（包含round或matchup），初始化對戰頁面
    if (currentPage.includes('round') || currentPage.includes('matchup')) {
        console.log('檢測到對戰頁面，初始化對戰數據');
        initMatchupPage();
    }

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
            button.addEventListener('click', async () => {
                const selectedTeamAbbr = button.getAttribute('data-team-abbr');
                console.log('Selected team:', selectedTeamAbbr);
                console.log('Current username:', localStorage.getItem('nbaPlayoffsUsername'));

                teamSections.forEach(section => {
                    const sectionAbbr = section.getAttribute('data-team-abbr');
                    section.classList.remove('selected', 'not-selected');
                    if (sectionAbbr === selectedTeamAbbr) {
                        section.classList.add('selected');
                    } else {
                        section.classList.add('not-selected');
                    }
                });
                await savePrediction(matchupId, selectedTeamAbbr, storageKey);

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
                console.log('Login attempt with username:', usernameValue);
                if (usernameValue) {
                    localStorage.setItem('nbaPlayoffsUsername', usernameValue);
                    console.log('Username saved:', localStorage.getItem('nbaPlayoffsUsername'));
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

            console.log('Current username on predictions page:', localStorage.getItem('nbaPlayoffsUsername'));
            console.log('Round 1 Predictions:', storedR1);
            console.log('Round 2 Predictions:', storedR2);
            console.log('Round 3 Predictions:', storedR3);
            console.log('Round 4 Predictions:', storedR4);

            // 嘗試從後端獲取預測數據
            const username = localStorage.getItem('nbaPlayoffsUsername');
            if (username) {
                console.log('Attempting to fetch predictions from API for user:', username);
                fetch(`https://two025nbagames-1.onrender.com/predictions/${username}`)
                    .then(response => {
                        console.log('API Response status:', response.status);
                        return response.json();
                    })
                    .then(data => {
                        console.log('API Response data:', data);
                    })
                    .catch(error => {
                        console.error('Error fetching predictions:', error);
                    });
            }

            const r1Complete = Object.keys(storedR1).length === 8;
            const r2Complete = Object.keys(storedR2).length === 4;
            const r3Complete = Object.keys(storedR3).length === 2;
            const r4Complete = Object.keys(storedR4).length === 1;
            const allComplete = r1Complete && r2Complete && r3Complete && r4Complete;

            console.log('Completion Status:', {
                round1: r1Complete,
                round2: r2Complete,
                round3: r3Complete,
                round4: r4Complete
            });

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
                            ${createMatchupHTML(teamDetails['OKC'], teamDetails['MIN'], r1Winners['W1v8'].abbr)}
                            ${createMatchupHTML(teamDetails['DEN'], teamDetails['LAC'], r1Winners['W4v5'].abbr)}
                            ${createMatchupHTML(teamDetails['LAL'], teamDetails['GSW'], r1Winners['W3v6'].abbr)}
                            ${createMatchupHTML(teamDetails['HOU'], teamDetails['MEM'], r1Winners['W2v7'].abbr)}
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
                         <div class="bracket-champion" data-team-abbr="${champion.abbr}">
                              <img src="${champion.logo}" alt="${champion.name}">
                              <span>${champion.abbr}</span>
                              <div class="title">2025 NBA Champion</div>
                         </div>
                    </div>
                    <div class="bracket-region"> <!-- East -->
                         <div class="bracket-round"> <!-- R3 East -->
                              ${createMatchupHTML(r2Winners['R2E1'], r2Winners['R2E2'], r3Winners['R3E'].abbr)}
                         </div>
                         <div class="bracket-round"> <!-- R2 East -->
                              ${createMatchupHTML(r1Winners['E1v8'], r1Winners['E4v5'], r2Winners['R2E1'].abbr)}
                              ${createMatchupHTML(r1Winners['E3v6'], r1Winners['E2v7'], r2Winners['R2E2'].abbr)}
                         </div>
                         <div class="bracket-round"> <!-- R1 East -->
                            ${createMatchupHTML(teamDetails['CLE'], teamDetails['ATL'], r1Winners['E1v8'].abbr)}
                            ${createMatchupHTML(teamDetails['IND'], teamDetails['MIL'], r1Winners['E4v5'].abbr)}
                            ${createMatchupHTML(teamDetails['NYK'], teamDetails['DET'], r1Winners['E3v6'].abbr)}
                            ${createMatchupHTML(teamDetails['BOS'], teamDetails['ORL'], r1Winners['E2v7'].abbr)}
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

    // 隊伍按鈕選擇邏輯
    const teamButtons = document.querySelectorAll('.team-button');

    teamButtons.forEach(button => {
        button.addEventListener('click', function () {
            // 移除其他按鈕的選中狀態
            teamButtons.forEach(btn => btn.classList.remove('selected'));

            // 為當前按鈕添加選中狀態
            this.classList.add('selected');

            // 獲取選中的球隊縮寫
            const selectedTeam = this.getAttribute('data-team');

            // 處理預測保存
            const isLeftTeam = this.classList.contains('left-team');
            const matchupId = getCurrentMatchupId();
            const storageKey = getCurrentStorageKey();

            if (matchupId && storageKey) {
                savePrediction(matchupId, selectedTeam, storageKey);
            }

            console.log('Selected team:', selectedTeam);

            // 如果是左側團隊，更新左側條形圖顏色；如果是右側團隊，更新右側條形圖顏色
            if (isLeftTeam) {
                updateBarColors(selectedTeam, document.querySelector('.right-team').getAttribute('data-team'));
            } else {
                updateBarColors(document.querySelector('.left-team').getAttribute('data-team'), selectedTeam);
            }

            // 導航到下一頁
            navigateToNextPage();
        });
    });

    // 獲取當前頁面的比賽ID
    function getCurrentMatchupId() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        let matchupId = null;

        if (currentPage.startsWith('matchup')) {
            const r1Match = currentPage.match(/matchup(\d+)([WE])\.html/);
            if (r1Match) {
                const num = parseInt(r1Match[1]);
                const conf = r1Match[2];
                const r1MatchupData = round1Matchups.find(m => m.matchupNum === num && m.conference.startsWith(conf));
                if (r1MatchupData) matchupId = r1MatchupData.id;
            }
        } else if (currentPage.startsWith('round2_') || currentPage.startsWith('round3_') || currentPage.startsWith('round4_')) {
            const round = parseInt(currentPage.charAt(5));
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
        return matchupId;
    }

    // 獲取當前回合的存儲鍵
    function getCurrentStorageKey() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        let storageKey = '';

        if (currentPage.startsWith('matchup')) {
            storageKey = 'round1Predictions';
        } else if (currentPage.startsWith('round2_')) {
            storageKey = 'round2Predictions';
        } else if (currentPage.startsWith('round3_')) {
            storageKey = 'round3Predictions';
        } else if (currentPage.startsWith('round4_')) {
            storageKey = 'round4Predictions';
        }

        return storageKey;
    }

    // 根據當前頁面導航到下一頁
    function navigateToNextPage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        let nextUrl = 'predictions.html'; // 默認頁面

        if (currentPage.startsWith('matchup')) {
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
        } else if (currentPage.startsWith('round2_') || currentPage.startsWith('round3_') || currentPage.startsWith('round4_')) {
            const matchupId = getCurrentMatchupId();
            if (matchupId && roundSources[matchupId]) {
                nextUrl = roundSources[matchupId].next;
            }
        }

        // 延遲一下再跳轉，讓用戶可以看到選擇效果
        setTimeout(() => {
            window.location.href = nextUrl;
        }, 500);
    }

    // 為統計數據行添加動畫效果
    const statsRows = document.querySelectorAll('.stats-row');

    // 先讓所有行可見
    statsRows.forEach((row, index) => {
        // 設置延遲顯示，使其看起來有序列動畫
        setTimeout(() => {
            row.style.opacity = '1';

            // 為條形圖添加動畫
            const leftBar = row.querySelector('.left-bar');
            const rightBar = row.querySelector('.right-bar');

            if (leftBar && rightBar) {
                // 先將寬度設為0
                const leftWidth = leftBar.style.width;
                const rightWidth = rightBar.style.width;

                leftBar.style.width = '0%';
                rightBar.style.width = '0%';

                // 然後漸進顯示到實際寬度
                setTimeout(() => {
                    leftBar.style.width = leftWidth;
                    rightBar.style.width = rightWidth;
                }, 50);
            }
        }, 100 * index);
    });

    // 設置隊伍按鈕的 logo 背景和文本
    const leftTeam = document.querySelector('.left-team');
    const rightTeam = document.querySelector('.right-team');

    if (leftTeam && rightTeam) {
        const leftTeamAbbr = leftTeam.getAttribute('data-team');
        const rightTeamAbbr = rightTeam.getAttribute('data-team');

        // 設置按鈕文本：縮寫 + 名次
        if (leftTeamAbbr && teamDetails[leftTeamAbbr]) {
            const leftTeamName = leftTeam.querySelector('span');
            if (leftTeamName) {
                leftTeamName.textContent = `${leftTeamAbbr} (${teamDetails[leftTeamAbbr].seed})`;
            }
        }

        if (rightTeamAbbr && teamDetails[rightTeamAbbr]) {
            const rightTeamName = rightTeam.querySelector('span');
            if (rightTeamName) {
                rightTeamName.textContent = `${rightTeamAbbr} (${teamDetails[rightTeamAbbr].seed})`;
            }
        }

        // 設置隊伍標誌作為背景
        if (leftTeamAbbr && teamDetails[leftTeamAbbr]) {
            const leftLogo = leftTeam.querySelector('.team-logo-bg');
            if (leftLogo) {
                leftLogo.style.backgroundImage = `url(${teamDetails[leftTeamAbbr].logo})`;
            }

            // 根據球隊設置正確的背景顏色
            switch (leftTeamAbbr) {
                case 'OKC':
                    leftTeam.style.backgroundColor = '#007AC1';
                    document.documentElement.style.setProperty('--left-team-color', '#007AC1');
                    break; // Thunder Blue
                case 'MIN':
                    leftTeam.style.backgroundColor = '#0C2340';
                    document.documentElement.style.setProperty('--left-team-color', '#0C2340');
                    break; // Timberwolves Navy
                case 'DEN':
                    leftTeam.style.backgroundColor = '#0E2240';
                    document.documentElement.style.setProperty('--left-team-color', '#0E2240');
                    break; // Nuggets Navy
                case 'LAC':
                    leftTeam.style.backgroundColor = '#C8102E';
                    document.documentElement.style.setProperty('--left-team-color', '#C8102E');
                    break; // Clippers Red
                case 'LAL':
                    leftTeam.style.backgroundColor = '#552583';
                    document.documentElement.style.setProperty('--left-team-color', '#552583');
                    break; // Lakers Purple
                case 'GSW':
                    leftTeam.style.backgroundColor = '#1D428A';
                    document.documentElement.style.setProperty('--left-team-color', '#1D428A');
                    break; // Warriors Blue
                case 'HOU':
                    leftTeam.style.backgroundColor = '#CE1141';
                    document.documentElement.style.setProperty('--left-team-color', '#CE1141');
                    break; // Rockets Red
                case 'MEM':
                    leftTeam.style.backgroundColor = '#5D76A9';
                    document.documentElement.style.setProperty('--left-team-color', '#5D76A9');
                    break; // Grizzlies Blue
                case 'CLE':
                    leftTeam.style.backgroundColor = '#860038';
                    document.documentElement.style.setProperty('--left-team-color', '#860038');
                    break; // Cavaliers Wine
                case 'ATL':
                    leftTeam.style.backgroundColor = '#E03A3E';
                    document.documentElement.style.setProperty('--left-team-color', '#E03A3E');
                    break; // Hawks Red
                case 'IND':
                    leftTeam.style.backgroundColor = '#002D62';
                    document.documentElement.style.setProperty('--left-team-color', '#002D62');
                    break; // Pacers Blue
                case 'MIL':
                    leftTeam.style.backgroundColor = '#00471B';
                    document.documentElement.style.setProperty('--left-team-color', '#00471B');
                    break; // Bucks Green
                case 'NYK':
                    leftTeam.style.backgroundColor = '#006BB6';
                    document.documentElement.style.setProperty('--left-team-color', '#006BB6');
                    break; // Knicks Blue
                case 'DET':
                    leftTeam.style.backgroundColor = '#C8102E';
                    document.documentElement.style.setProperty('--left-team-color', '#C8102E');
                    break; // Pistons Red
                case 'BOS':
                    leftTeam.style.backgroundColor = '#007A33';
                    document.documentElement.style.setProperty('--left-team-color', '#007A33');
                    break; // Celtics Green
                case 'ORL':
                    leftTeam.style.backgroundColor = '#0077C0';
                    document.documentElement.style.setProperty('--left-team-color', '#0077C0');
                    break; // Magic Blue
                default:
                    leftTeam.style.backgroundColor = '#00538C';
                    document.documentElement.style.setProperty('--left-team-color', '#00538C');
                    break;    // 默認藍色
            }
        }

        if (rightTeamAbbr && teamDetails[rightTeamAbbr]) {
            const rightLogo = rightTeam.querySelector('.team-logo-bg');
            if (rightLogo) {
                rightLogo.style.backgroundImage = `url(${teamDetails[rightTeamAbbr].logo})`;
            }

            // 根據球隊設置正確的背景顏色
            switch (rightTeamAbbr) {
                case 'OKC':
                    rightTeam.style.backgroundColor = '#007AC1';
                    document.documentElement.style.setProperty('--right-team-color', '#007AC1');
                    break; // Thunder Blue
                case 'MIN':
                    rightTeam.style.backgroundColor = '#0C2340';
                    document.documentElement.style.setProperty('--right-team-color', '#0C2340');
                    break; // Timberwolves Navy
                case 'DEN':
                    rightTeam.style.backgroundColor = '#0E2240';
                    document.documentElement.style.setProperty('--right-team-color', '#0E2240');
                    break; // Nuggets Navy
                case 'LAC':
                    rightTeam.style.backgroundColor = '#C8102E';
                    document.documentElement.style.setProperty('--right-team-color', '#C8102E');
                    break; // Clippers Red
                case 'LAL':
                    rightTeam.style.backgroundColor = '#552583';
                    document.documentElement.style.setProperty('--right-team-color', '#552583');
                    break; // Lakers Purple
                case 'GSW':
                    rightTeam.style.backgroundColor = '#1D428A';
                    document.documentElement.style.setProperty('--right-team-color', '#1D428A');
                    break; // Warriors Blue
                case 'HOU':
                    rightTeam.style.backgroundColor = '#CE1141';
                    document.documentElement.style.setProperty('--right-team-color', '#CE1141');
                    break; // Rockets Red
                case 'MEM':
                    rightTeam.style.backgroundColor = '#5D76A9';
                    document.documentElement.style.setProperty('--right-team-color', '#5D76A9');
                    break; // Grizzlies Blue
                case 'CLE':
                    rightTeam.style.backgroundColor = '#860038';
                    document.documentElement.style.setProperty('--right-team-color', '#860038');
                    break; // Cavaliers Wine
                case 'ATL':
                    rightTeam.style.backgroundColor = '#E03A3E';
                    document.documentElement.style.setProperty('--right-team-color', '#E03A3E');
                    break; // Hawks Red
                case 'IND':
                    rightTeam.style.backgroundColor = '#002D62';
                    document.documentElement.style.setProperty('--right-team-color', '#002D62');
                    break; // Pacers Blue
                case 'MIL':
                    rightTeam.style.backgroundColor = '#00471B';
                    document.documentElement.style.setProperty('--right-team-color', '#00471B');
                    break; // Bucks Green
                case 'NYK':
                    rightTeam.style.backgroundColor = '#006BB6';
                    document.documentElement.style.setProperty('--right-team-color', '#006BB6');
                    break; // Knicks Blue
                case 'DET':
                    rightTeam.style.backgroundColor = '#C8102E';
                    document.documentElement.style.setProperty('--right-team-color', '#C8102E');
                    break; // Pistons Red
                case 'BOS':
                    rightTeam.style.backgroundColor = '#007A33';
                    document.documentElement.style.setProperty('--right-team-color', '#007A33');
                    break; // Celtics Green
                case 'ORL':
                    rightTeam.style.backgroundColor = '#0077C0';
                    document.documentElement.style.setProperty('--right-team-color', '#0077C0');
                    break; // Magic Blue
                default:
                    rightTeam.style.backgroundColor = '#00538C';
                    document.documentElement.style.setProperty('--right-team-color', '#00538C');
                    break;    // 默認藍色
            }
        }
    }

    // 當頁面載入時，檢查是否是對戰統計頁面，並更新數據
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        console.log('找到統計容器，準備更新對戰數據');
        const leftTeam = document.querySelector('.left-team');
        const rightTeam = document.querySelector('.right-team');

        if (leftTeam && rightTeam) {
            const leftTeamAbbr = leftTeam.getAttribute('data-team');
            const rightTeamAbbr = rightTeam.getAttribute('data-team');

            console.log(`球隊縮寫: 左=${leftTeamAbbr}, 右=${rightTeamAbbr}`);

            if (leftTeamAbbr && rightTeamAbbr) {
                // 更新對戰統計數據
                updateMatchupStats(leftTeamAbbr, rightTeamAbbr);

                // 更新長條圖顏色
                updateBarColors(leftTeamAbbr, rightTeamAbbr);
            } else {
                console.error('無法獲取球隊縮寫');
            }
        } else {
            console.error('頁面上找不到球隊元素');
        }
    }

    // 更新長條圖和數值顏色
    function updateBarColors(leftTeamAbbr, rightTeamAbbr) {
        console.log(`Updating colors for teams: ${leftTeamAbbr} vs ${rightTeamAbbr}`);
        const leftBars = document.querySelectorAll('.left-bar');
        const rightBars = document.querySelectorAll('.right-bar');
        const leftValues = document.querySelectorAll('.left-value');
        const rightValues = document.querySelectorAll('.right-value');

        // 也更新按鈕顏色
        const leftTeamBtn = document.querySelector('.left-team');
        const rightTeamBtn = document.querySelector('.right-team');

        // 獲取球隊對應的顏色
        let leftColor = getTeamColorByAbbr(leftTeamAbbr) || '#552583'; // 默認 Lakers Purple
        let rightColor = getTeamColorByAbbr(rightTeamAbbr) || '#007AC1'; // 默認 Thunder Blue

        console.log(`Colors selected - Left team (${leftTeamAbbr}): ${leftColor}, Right team (${rightTeamAbbr}): ${rightColor}`);

        // 同時設置CSS變量和直接樣式，以確保顏色正確應用
        document.documentElement.style.setProperty('--left-team-color', leftColor);
        document.documentElement.style.setProperty('--right-team-color', rightColor);

        // 直接設置按鈕背景顏色
        if (leftTeamBtn) {
            console.log(`Applying ${leftColor} to left button for team ${leftTeamAbbr}`);
            leftTeamBtn.style.backgroundColor = leftColor;
            // 確保標籤文字可讀
            const leftSpan = leftTeamBtn.querySelector('span');
            if (leftSpan) {
                leftSpan.style.color = 'white';
                leftSpan.style.textShadow = '0 0 5px rgba(0, 0, 0, 0.7)';
            }
        } else {
            console.warn(`Left team button not found for team ${leftTeamAbbr}`);
        }

        if (rightTeamBtn) {
            console.log(`Applying ${rightColor} to right button for team ${rightTeamAbbr}`);
            rightTeamBtn.style.backgroundColor = rightColor;
            // 確保標籤文字可讀
            const rightSpan = rightTeamBtn.querySelector('span');
            if (rightSpan) {
                rightSpan.style.color = 'white';
                rightSpan.style.textShadow = '0 0 5px rgba(0, 0, 0, 0.7)';
            }
        } else {
            console.warn(`Right team button not found for team ${rightTeamAbbr}`);
        }

        // 直接設置長條圖背景顏色
        leftBars.forEach(bar => {
            bar.style.transition = 'background-color 0.5s ease-in-out, width 0.5s ease-out';
            bar.style.backgroundColor = leftColor;
        });

        rightBars.forEach(bar => {
            bar.style.transition = 'background-color 0.5s ease-in-out, width 0.5s ease-out';
            bar.style.backgroundColor = rightColor;
        });

        // 直接設置數值顏色
        leftValues.forEach(value => {
            value.style.transition = 'color 0.5s ease-in-out';
            value.style.color = leftColor;
        });

        rightValues.forEach(value => {
            value.style.transition = 'color 0.5s ease-in-out';
            value.style.color = rightColor;
        });

        console.log(`Team colors have been applied successfully`);

        // 如果統計容器存在，立即更新統計數據顯示
        const statsContainer = document.querySelector('.stats-container');
        if (statsContainer) {
            // 重新觸發已有統計數據的顏色更新
            const rows = document.querySelectorAll('.stats-row');
            if (rows.length > 0) {
                console.log('找到現有統計行，直接更新顏色');
                rows.forEach(row => {
                    const leftBarEl = row.querySelector('.left-bar');
                    const rightBarEl = row.querySelector('.right-bar');
                    const leftValueEl = row.querySelector('.left-value');
                    const rightValueEl = row.querySelector('.right-value');

                    if (leftBarEl) leftBarEl.style.backgroundColor = leftColor;
                    if (rightBarEl) rightBarEl.style.backgroundColor = rightColor;
                    if (leftValueEl) leftValueEl.style.color = leftColor;
                    if (rightValueEl) rightValueEl.style.color = rightColor;
                });
            }
        }
    }

    // 其他頁面初始化邏輯...
    // 這裡可以根據不同頁面類型調用不同的初始化函數
});

function updatePieChart(predictions) {
    const pieChart = document.getElementById('pieChart');
    if (!pieChart) return;

    // 計算每個球隊的預測次數
    const teamCounts = {};
    predictions.forEach(prediction => {
        const team = prediction.selected_team;
        teamCounts[team] = (teamCounts[team] || 0) + 1;
    });

    // 將數據轉換為 Chart.js 格式
    const labels = Object.keys(teamCounts).map(team => teamDetails[team].name);
    const data = Object.values(teamCounts);
    const backgroundColors = Object.keys(teamCounts).map(team => {
        const color = getComputedStyle(document.querySelector(`.team-section[data-team-abbr="${team}"]`)).backgroundColor;
        return color || '#CCCCCC';
    });

    // 銷毀現有的圖表實例
    if (window.pieChartInstance) {
        window.pieChartInstance.destroy();
    }

    // 創建新的圖表
    const ctx = pieChart.getContext('2d');
    window.pieChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * 從本地獲取對戰數據
 * @param {string} team1 - 第一支球隊縮寫 (左側，例如 "OKC")
 * @param {string} team2 - 第二支球隊縮寫 (右側，例如 "MIN")
 * @returns {Promise<Object>} - 包含對戰數據的對象
 */
async function fetchMatchupData(team1, team2) {
    try {
        console.log(`嘗試獲取${team1} vs ${team2}的對戰數據`);

        // 構建對戰鍵 (例如 "OKCvsMIN")
        const directMatchupKey = `${team1}vs${team2}`;
        const reverseMatchupKey = `${team2}vs${team1}`;

        // 使用確定的正確路徑獲取JSON文件
        const response = await fetch('./backend/data/matchup_stats.json');
        if (!response.ok) {
            console.error(`獲取數據失敗，狀態碼: ${response.status}`);
            throw new Error(`無法獲取對戰數據: ${response.statusText}`);
        }

        const allMatchups = await response.json();
        console.log('獲取到的所有對戰數據，keys數量:', Object.keys(allMatchups).length);
        console.log('對戰keys示例:', Object.keys(allMatchups).slice(0, 5));

        // 先嘗試直接的對戰鍵
        if (directMatchupKey in allMatchups) {
            console.log(`找到直接對戰數據 ${directMatchupKey}:`, allMatchups[directMatchupKey]);

            // 在直接對戰中，team1對應數據的第一個值，team2對應第二個值
            // 例如: "OKCvsMIN" => OKC是[0], MIN是[1]
            return allMatchups[directMatchupKey];
        }
        // 如果沒有直接對戰，嘗試反向對戰鍵
        else if (reverseMatchupKey in allMatchups) {
            console.log(`找到反向對戰數據 ${reverseMatchupKey}:`, allMatchups[reverseMatchupKey]);

            // 在反向對戰中，需要交換數據順序，因為team1現在對應數據的第二個值，team2對應第一個值
            // 例如: "MINvsOKC" => MIN是[0], OKC是[1]，但我們顯示需要OKC在左(對應[0])，MIN在右(對應[1])
            const reverseData = allMatchups[reverseMatchupKey];
            const fixedData = {};

            for (const stat in reverseData) {
                if (Array.isArray(reverseData[stat]) && reverseData[stat].length === 2) {
                    fixedData[stat] = [reverseData[stat][1], reverseData[stat][0]];
                } else {
                    fixedData[stat] = reverseData[stat];
                }
            }

            console.log('處理後的數據:', fixedData);
            return fixedData;
        }
        // 如果在文件中找不到對戰數據，則拋出錯誤
        else {
            console.error(`未找到 ${directMatchupKey} 或 ${reverseMatchupKey} 的對戰數據`);
            console.log('前5個可用對戰:', Object.keys(allMatchups).slice(0, 5).join(', '));
            throw new Error(`未找到 ${team1} vs ${team2} 的對戰數據`);
        }
    } catch (error) {
        console.error('獲取對戰數據時出錯:', error);
        // 返回空數據，前端需要處理這種情況
        return {
            "PTS": [0, 0],
            "REB": [0, 0],
            "AST": [0, 0],
            "STL": [0, 0],
            "BLK": [0, 0],
            "TOV": [0, 0],
            "FG%": [0, 0],
            "3P%": [0, 0],
            "FT%": [0, 0]
        };
    }
}

/**
 * 更新對戰統計數據
 * @param {string} team1 - 第一支球隊縮寫 (左側，例如 "OKC")
 * @param {string} team2 - 第二支球隊縮寫 (右側，例如 "MIN")
 */
async function updateMatchupStats(team1, team2) {
    console.log(`更新對戰統計: ${team1} vs ${team2}`);
    try {
        const matchupData = await fetchMatchupData(team1, team2);
        console.log('獲取到對戰數據:', matchupData);

        if (matchupData) {
            updateMatchupStatsUI(matchupData);

            // 作為測試，也在控制台中以表格形式顯示數據
            console.table({
                '球隊': [team1, team2],
                'Wins': matchupData.Wins || [0, 0],
                'PTS': matchupData.PTS || [0, 0],
                'REB': matchupData.REB || [0, 0],
                'AST': matchupData.AST || [0, 0],
                'STL': matchupData.STL || [0, 0],
                'BLK': matchupData.BLK || [0, 0],
                'TOV': matchupData.TOV || [0, 0],
                'FG%': matchupData['FG%'] || [0, 0],
                '3P%': matchupData['3P%'] || [0, 0],
                'FT%': matchupData['FT%'] || [0, 0],
            });
        } else {
            console.error('未能獲取對戰數據');
        }
    } catch (error) {
        console.error('更新對戰統計時出錯:', error);
    }
}

/**
 * 在頁面上動態更新對戰統計數據的UI
 * @param {Object} statsData - 包含統計數據的對象
 * @param {string} containerId - 統計容器的ID，默認為'.stats-container'
 */
function updateMatchupStatsUI(statsData, containerId = '.stats-container') {
    console.log('開始更新UI，數據:', statsData);
    const statsContainer = document.querySelector(containerId);
    if (!statsContainer) {
        console.error('找不到統計數據容器:', containerId);
        return;
    }

    statsContainer.innerHTML = ''; // 清空現有內容

    // 獲取左右隊伍的顏色
    const leftTeamBtn = document.querySelector('.left-team');
    const rightTeamBtn = document.querySelector('.right-team');
    let leftTeamColor = '#552583'; // 默認 Lakers Purple
    let rightTeamColor = '#007AC1'; // 默認 Thunder Blue

    if (leftTeamBtn) {
        const teamAbbr = leftTeamBtn.getAttribute('data-team');
        leftTeamColor = getTeamColorByAbbr(teamAbbr) || leftTeamColor;
    }

    if (rightTeamBtn) {
        const teamAbbr = rightTeamBtn.getAttribute('data-team');
        rightTeamColor = getTeamColorByAbbr(teamAbbr) || rightTeamColor;
    }

    // 按順序添加所有統計數據行
    const statKeys = ['Wins', "PTS", "REB", "AST", "STL", "BLK", "TOV", "FG%", "3P%", "FT%"];

    statKeys.forEach(stat => {
        if (!statsData[stat]) {
            console.warn(`找不到 ${stat} 的數據`);
            return;
        }

        const leftValue = statsData[stat][0];
        const rightValue = statsData[stat][1];

        console.log(`更新統計 ${stat}: ${leftValue} vs ${rightValue}`);

        // 計算百分比寬度（基於左右值的相對大小）
        let leftWidth, rightWidth;

        if (stat === "TOV") {
            // 對於失誤，較小的值更好，所以反轉比例
            const total = leftValue + rightValue;
            leftWidth = total === 0 ? 50 : Math.round((rightValue / total) * 100);
            rightWidth = total === 0 ? 50 : Math.round((leftValue / total) * 100);
        } else if (stat === "Wins") {
            // 特殊處理勝場數據
            const total = leftValue + rightValue;

            if (leftValue === 0) {
                // 左邊0勝，右邊有勝場
                leftWidth = 0; // 給予最小寬度，讓0勝也能顯示
                rightWidth = 100;
            } else if (rightValue === 0) {
                // 右邊0勝，左邊有勝場
                leftWidth = 100;
                rightWidth = 0; // 給予最小寬度，讓0勝也能顯示
            } else {
                // 雙方都有勝場的情況下正常計算
                leftWidth = Math.round((leftValue / total) * 100);
                rightWidth = Math.round((rightValue / total) * 100);

                // 確保寬度至少為33%，最多為67%，以便視覺上更好
                // leftWidth = Math.max(33, Math.min(67, leftWidth));
                // rightWidth = Math.max(33, Math.min(67, rightWidth));
            }
        } else {
            // 對於其他統計，較大的值更好
            const total = leftValue + rightValue;
            leftWidth = total === 0 ? 50 : Math.round((leftValue / total) * 100);
            rightWidth = total === 0 ? 50 : Math.round((rightValue / total) * 100);

            // 確保寬度至少為33%，最多為67%，以便視覺上更好
            // leftWidth = Math.max(33, Math.min(67, leftWidth));
            // rightWidth = Math.max(33, Math.min(67, rightWidth));
        }

        // 創建統計行的HTML，直接使用內聯樣式設置顏色
        const rowHTML = `
            <div class="stats-row">
                <div class="left-value" style="color: ${leftTeamColor}">${typeof leftValue === 'number' && stat.includes('%') ? leftValue.toFixed(1) : leftValue}</div>
                <div class="bar-container">
                    <div class="left-bar" style="width: ${leftWidth}%; background-color: ${leftTeamColor}"></div>
                    <div class="stat-label">${stat}</div>
                    <div class="right-bar" style="width: ${rightWidth}%; background-color: ${rightTeamColor}"></div>
                </div>
                <div class="right-value" style="color: ${rightTeamColor}">${typeof rightValue === 'number' && stat.includes('%') ? rightValue.toFixed(1) : rightValue}</div>
            </div>
        `;

        statsContainer.innerHTML += rowHTML;
    });

    // 添加動畫效果
    const rows = document.querySelectorAll('.stats-row');
    rows.forEach((row, index) => {
        row.style.opacity = '0';
        setTimeout(() => {
            row.style.opacity = '1';
        }, 100 * index);
    });
}

// 輔助函數：根據球隊縮寫獲取顏色
function getTeamColorByAbbr(teamAbbr) {
    switch (teamAbbr) {
        case 'OKC': return '#007AC1'; // Thunder Blue
        case 'MIN': return '#0C2340'; // Timberwolves Navy
        case 'DEN': return '#0E2240'; // Nuggets Navy
        case 'LAC': return '#C8102E'; // Clippers Red
        case 'LAL': return '#552583'; // Lakers Purple
        case 'GSW': return '#1D428A'; // Warriors Blue
        case 'HOU': return '#CE1141'; // Rockets Red
        case 'MEM': return '#5D76A9'; // Grizzlies Blue
        case 'CLE': return '#860038'; // Cavaliers Wine
        case 'ATL': return '#E03A3E'; // Hawks Red
        case 'IND': return '#002D62'; // Pacers Blue
        case 'MIL': return '#00471B'; // Bucks Green
        case 'NYK': return '#006BB6'; // Knicks Blue
        case 'DET': return '#C8102E'; // Pistons Red
        case 'BOS': return '#007A33'; // Celtics Green
        case 'ORL': return '#0077C0'; // Magic Blue
        default: return null;
    }
}

/**
 * 更新對戰統計顯示
 * 測試函數 - 在控制台顯示對戰統計，確認數據是否正確獲取和顯示
 */
function debugMatchupStats() {
    const leftTeam = document.querySelector('.left-team');
    const rightTeam = document.querySelector('.right-team');

    if (!leftTeam || !rightTeam) {
        console.error('找不到隊伍元素');
        return;
    }

    const leftTeamAbbr = leftTeam.getAttribute('data-team');
    const rightTeamAbbr = rightTeam.getAttribute('data-team');

    if (!leftTeamAbbr || !rightTeamAbbr) {
        console.error('無法獲取隊伍縮寫');
        return;
    }

    console.log(`測試對戰: ${leftTeamAbbr} (左側) vs ${rightTeamAbbr} (右側)`);

    fetchMatchupData(leftTeamAbbr, rightTeamAbbr)
        .then(data => {
            console.log('對戰統計數據:');
            console.table({
                '球隊': [leftTeamAbbr, rightTeamAbbr],
                'Wins': data.Wins || [0, 0],
                'PTS': data.PTS || [0, 0],
                'REB': data.REB || [0, 0],
                'AST': data.AST || [0, 0],
                'STL': data.STL || [0, 0],
                'BLK': data.BLK || [0, 0],
                'TOV': data.TOV || [0, 0],
                'FG%': data['FG%'] || [0, 0],
                '3P%': data['3P%'] || [0, 0],
                'FT%': data['FT%'] || [0, 0],
            });
        })
        .catch(error => {
            console.error('測試時出錯:', error);
        });
}

// 診斷函數：檢查所有球隊顏色應用是否正確
function debugTeamColors() {
    const leftTeamBtn = document.querySelector('.left-team');
    const rightTeamBtn = document.querySelector('.right-team');

    if (!leftTeamBtn || !rightTeamBtn) {
        console.log('找不到球隊按鈕，無法進行顏色診斷');
        return;
    }

    const leftTeamAbbr = leftTeamBtn.getAttribute('data-team');
    const rightTeamAbbr = rightTeamBtn.getAttribute('data-team');

    if (!leftTeamAbbr || !rightTeamAbbr) {
        console.log('球隊按鈕缺少data-team屬性，無法識別球隊');
        return;
    }

    console.log('=== 球隊顏色診斷開始 ===');
    console.log(`左隊：${leftTeamAbbr}，右隊：${rightTeamAbbr}`);

    // 檢查CSS變量
    const rootStyle = getComputedStyle(document.documentElement);
    const leftColorVar = rootStyle.getPropertyValue('--left-team-color').trim();
    const rightColorVar = rootStyle.getPropertyValue('--right-team-color').trim();

    console.log(`CSS變量 --left-team-color: "${leftColorVar}"`);
    console.log(`CSS變量 --right-team-color: "${rightColorVar}"`);

    // 檢查按鈕顏色
    const leftBtnColor = getComputedStyle(leftTeamBtn).backgroundColor;
    const rightBtnColor = getComputedStyle(rightTeamBtn).backgroundColor;

    console.log(`左隊按鈕實際顏色: "${leftBtnColor}"`);
    console.log(`右隊按鈕實際顏色: "${rightBtnColor}"`);

    // 檢查統計條顏色
    const leftBars = document.querySelectorAll('.left-bar');
    const rightBars = document.querySelectorAll('.right-bar');

    if (leftBars.length > 0) {
        const leftBarColor = getComputedStyle(leftBars[0]).backgroundColor;
        console.log(`左隊統計條顏色: "${leftBarColor}"`);
    } else {
        console.log('找不到左隊統計條');
    }

    if (rightBars.length > 0) {
        const rightBarColor = getComputedStyle(rightBars[0]).backgroundColor;
        console.log(`右隊統計條顏色: "${rightBarColor}"`);
    } else {
        console.log('找不到右隊統計條');
    }

    console.log('=== 球隊顏色診斷結束 ===');

    // 如果發現問題，再次强制應用顏色
    if (leftTeamAbbr && rightTeamAbbr) {
        console.log('重新強制應用球隊顏色...');
        updateBarColors(leftTeamAbbr, rightTeamAbbr);
    }
}

// 在頁面加載時運行診斷
document.addEventListener('DOMContentLoaded', function () {
    // 原有的DOMContentLoaded處理邏輯保持不變

    // 在頁面加載500毫秒後運行球隊顏色診斷，確保所有樣式已經應用
    setTimeout(debugTeamColors, 500);
});

// 自動補救措施：如果在頁面加載2秒後發現問題，再次嘗試應用顏色
setTimeout(function () {
    const leftTeamBtn = document.querySelector('.left-team');
    const rightTeamBtn = document.querySelector('.right-team');

    if (leftTeamBtn && rightTeamBtn) {
        const leftTeamAbbr = leftTeamBtn.getAttribute('data-team');
        const rightTeamAbbr = rightTeamBtn.getAttribute('data-team');

        if (leftTeamAbbr && rightTeamAbbr) {
            console.log('自動補救：2秒後再次應用球隊顏色...');
            updateBarColors(leftTeamAbbr, rightTeamAbbr);
        }
    }
}, 2000);

