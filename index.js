class View {
    constructor() {
        this.app = document.getElementById('app')
        this.title = this.createElement('h1', 'title')
        this.title.textContent = 'Github search repos'

        this.searchLine = this.createElement('div', 'search-line')
        this.searchInput = this.createElement('input', 'search-input')
        this.searchLine.append(this.searchInput)

        this.repoWrapper = this.createElement('div', 'repo-wrapper')
        this.reposList = this.createElement('ul', 'repos')
        this.repoWrapper.append(this.reposList)

        this.main = this.createElement('div', 'main')
        this.main.append(this.repoWrapper)

        this.app.append(this.title)
        this.app.append(this.searchLine)
        this.app.append(this.main)
    }

    createElement(elementTag, elementClass) {
        const element = document.createElement(elementTag)
        if (elementClass) {
            element.classList.add(elementClass)
        }
        return element
    }

    createRepo (repoData) {
        const repo = this.createElement('button', 'repo')
        repo.innerHTML = `<p class="repo-name">${repoData.name}</p>`
        repo.addEventListener('click', () => {
            this.searchInput.value = ''
            this.addRepo(repoData);
        });
        this.reposList.append(repo)
    }
    addRepo(repoData) {
        const repoList = this.createElement('div', 'repo-list');
        repoList.innerHTML = `<div class="text-container">
                                <p class="repo-list-name">Name:${repoData.name}</p>
                                <p class="repo-list-owner">Owner:${repoData.owner.login}</p>
                                <p class="repo-list-stars">Stars:${repoData.stargazers_count}</p>
                              </div>
                              <button class="repo-list-btn">X</button>`;
        this.main.append(repoList); 
        
        const deleteButton = repoList.querySelector('.repo-list-btn');
        deleteButton.addEventListener('click', () => {
            repoList.remove();
        });
    }
}

class Search {
    constructor(view) {
        this.view = view
        this.view.searchInput.addEventListener('keyup', this.debounce(this.searchRepos.bind(this), 400)) //this.searchRepos.bind(this)
    }

    async searchRepos() {
        const searchValue = this.view.searchInput.value
        if (searchValue) {
            const response = await fetch(`https://api.github.com/search/repositories?q=${searchValue}&per_page=5`);
                if (response.ok) {
                    const data = await response.json();
                    data.items.forEach(repo => {
                        this.view.createRepo(repo);
                    });
                    this.addRepo(data);
                }
        } else {
            this.clearSearch()
        }
    }
    clearSearch () {
        this.view.reposList.innerHTML = ''
    }
    debounce = (fn, debounceTime) => {
        let timeout
        return function () {
            const fnCall = () => fn.apply(this, arguments)
    
            clearTimeout(timeout)
            
            timeout = setTimeout(fnCall, debounceTime)
        }
    };
}

new Search(new View())
