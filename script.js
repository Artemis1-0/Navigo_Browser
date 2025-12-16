 let searchEngines = {};
            let backgrounds = [];
            let backgroundsFull = {};

            async function loadData() {
            const [enginesRes, bgRes] = await Promise.all([
                fetch('/data/searchEngines.json'),
                fetch('/data/backgrounds.json')
            ]);

            searchEngines = await enginesRes.json();
            const bgData = await bgRes.json();

            backgrounds = bgData.thumbs;
            backgroundsFull = bgData.full;
            }

        let currentSearchEngine = 'google';

        function handleSearch(event) {
            if (event.key === 'Enter') {
                let searchText = event.target.value.trim();
                if (searchText !== '') {
                    if (!searchText.startsWith('http://') && !searchText.startsWith('https://')) {
                        searchText = searchEngines[currentSearchEngine] + encodeURIComponent(searchText);
                    }
                    window.location.href = searchText;
                }
            }
 }

        function changeSearchEngine(engine) {
            currentSearchEngine = engine;
            localStorage.setItem('searchEngine', engine);
            updateEngineIcon();
            toggleEngineOptions();
        }

        function updateEngineIcon() {
            document.getElementById('currentEngineIcon').src = `icons/searchEngines/${currentSearchEngine}.svg`;
        }

        function toggleEngineOptions() {
            const options = document.getElementById('engineOptions');
            options.style.display = options.style.display === 'none' ? 'block' : 'none';
        }

        function changeBackground() {
            const bgUrl = document.getElementById('bgUrl').value;
            document.body.style.backgroundImage = `url('${bgUrl}')`;
            localStorage.setItem('background', bgUrl);
        }

        function loadSettings() {
            const savedEngine = localStorage.getItem('searchEngine');
            if (savedEngine) {
                currentSearchEngine = savedEngine;
                updateEngineIcon();
            }

            const savedBg = localStorage.getItem('background');
            if (savedBg) {
                document.body.style.backgroundImage = `url('${savedBg}')`;
                document.getElementById('bgUrl').value = savedBg;
            }
        }

        function toggleSidebar() {
            document.querySelector('.sidebar').classList.toggle('open');
        }

        function setBackground(url) {
            document.body.style.backgroundImage = `url('${url}')`;
            localStorage.setItem('background', url);
        }

        function createBackgroundOptions() {
            const grid = document.querySelector('.background-grid');
            backgrounds.forEach((bg, index) => {
                const option = document.createElement('div');
                option.className = 'background-option';
                option.style.backgroundImage = `url('${bg}')`;
                option.onclick = () => setBackground(backgroundsFull[index]);
                grid.appendChild(option);
            });
        }

        document.addEventListener('DOMContentLoaded', async function() {
        await loadData();

        const searchBox = document.querySelector('.search-box');
        searchBox.addEventListener('keypress', handleSearch);
        searchBox.focus();

        loadSettings();
        createBackgroundOptions();
        });