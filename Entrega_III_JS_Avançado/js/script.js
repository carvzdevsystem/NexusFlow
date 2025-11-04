// ========== GERENCIADOR DE ESTADO DA APLICAÇÃO ==========
class AppState {
    constructor() {
        this.pessoas = JSON.parse(localStorage.getItem('nexusflow-pessoas')) || [];
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.navigateTo('home');
    }

    setupEventListeners() {
        // Navegação por botões
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-btn')) {
                const page = e.target.closest('.nav-btn').dataset.page;
                this.navigateTo(page);
            }
        });

        // Evento customizado para navegação
        window.addEventListener('pageChange', (e) => {
            this.navigateTo(e.detail.page);
        });

        // Submit do formulário
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'cadastroForm') {
                e.preventDefault();
                this.handleFormSubmit(e.target);
            }
        });

        // Deleção de pessoas
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const id = e.target.dataset.id;
                this.deletePessoa(id);
            }
        });
    }

    // ========== GERENCIAMENTO DE PÁGINAS ==========
    navigateTo(page) {
        this.currentPage = page;
        this.updateNavigation();
        this.renderPage();
    }

    updateNavigation() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.setAttribute('aria-current', 
                btn.dataset.page === this.currentPage ? 'page' : 'false');
        });
    }

    renderPage() {
        const content = document.getElementById('content');
        
        switch(this.currentPage) {
            case 'home':
                content.innerHTML = this.renderHome();
                break;
            case 'form':
                content.innerHTML = this.renderForm();
                break;
            case 'pessoas':
                content.innerHTML = this.renderPessoas();
                break;
            case 'sobre':
                content.innerHTML = this.renderSobre();
                break;
        }

        // Anima a entrada do conteúdo
        content.style.animation = 'none';
        setTimeout(() => {
            content.style.animation = 'cardAppear 0.6s ease-out';
        }, 10);
    }

    // ========== RENDERIZAÇÃO DAS PÁGINAS ==========
    renderHome() {
        return `
            <div class="content-card">
                <div class="hero-section">
                    <h2 class="text-gradient">Bem-vindo ao NexusFlow</h2>
                    <p class="hero-description">Sistema moderno de cadastro e gerenciamento de pessoas</p>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon">👥</div>
                            <div class="stat-number">${this.pessoas.length}</div>
                            <div class="stat-label">Pessoas Cadastradas</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">⚡</div>
                            <div class="stat-number">${this.getMediaIdade()}</div>
                            <div class="stat-label">Idade Média</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">🎯</div>
                            <div class="stat-number">${this.getTotalGeneros()}</div>
                            <div class="stat-label">Gêneros</div>
                        </div>
                    </div>

                    <div class="cta-buttons">
                        <button class="cta-btn primary" data-page="form">
                            <span>➕ Cadastrar Pessoa</span>
                        </button>
                        <button class="cta-btn secondary" data-page="pessoas">
                            <span>👥 Ver Todas</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderForm() {
        return `
            <div class="content-card">
                <div class="form-header">
                    <h2 class="text-gradient">Cadastro de Pessoa</h2>
                    <p>Preencha os dados abaixo para cadastrar uma nova pessoa</p>
                </div>

                <form id="cadastroForm" class="abstract-form" novalidate>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="nome" class="form-label">Nome Completo *</label>
                            <input type="text" id="nome" name="nome" class="form-input" required 
                                   placeholder="Digite o nome completo">
                            <div class="error-message" id="nomeError"></div>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="email" class="form-label">E-mail *</label>
                            <input type="email" id="email" name="email" class="form-input" required 
                                   placeholder="exemplo@email.com">
                            <div class="error-message" id="emailError"></div>
                        </div>
                        
                        <div class="form-group">
                            <label for="telefone" class="form-label">Telefone</label>
                            <input type="tel" id="telefone" name="telefone" class="form-input" 
                                   placeholder="(11) 99999-9999">
                            <div class="error-message" id="telefoneError"></div>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="idade" class="form-label">Idade *</label>
                            <input type="number" id="idade" name="idade" class="form-input" required 
                                   min="0" max="120" placeholder="Idade">
                            <div class="error-message" id="idadeError"></div>
                        </div>
                        
                        <div class="form-group">
                            <label for="genero" class="form-label">Gênero *</label>
                            <select id="genero" name="genero" class="form-input" required>
                                <option value="">Selecione...</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Não-binário">Não-binário</option>
                                <option value="Outro">Outro</option>
                                <option value="Prefiro não informar">Prefiro não informar</option>
                            </select>
                            <div class="error-message" id="generoError"></div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="endereco" class="form-label">Endereço</label>
                        <textarea id="endereco" name="endereco" class="form-input" 
                                  placeholder="Digite o endereço completo" rows="3"></textarea>
                    </div>

                    <div class="form-group">
                        <label for="observacoes" class="form-label">Observações</label>
                        <textarea id="observacoes" name="observacoes" class="form-input" 
                                  placeholder="Observações adicionais..." rows="3"></textarea>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="submit-btn">
                            <span>💾 Cadastrar Pessoa</span>
                        </button>
                        <button type="button" class="secondary-btn" onclick="appState.navigateTo('home')">
                            <span>↩️ Voltar</span>
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    renderPessoas() {
        if (this.pessoas.length === 0) {
            return `
                <div class="content-card">
                    <div class="empty-state">
                        <div class="empty-icon">👥</div>
                        <h3>Nenhuma pessoa cadastrada</h3>
                        <p>Comece cadastrando a primeira pessoa no sistema.</p>
                        <button class="cta-btn primary" data-page="form">
                            <span>➕ Cadastrar Primeira Pessoa</span>
                        </button>
                    </div>
                </div>
            `;
        }

        return `
            <div class="content-card">
                <div class="page-header">
                    <h2 class="text-gradient">Pessoas Cadastradas</h2>
                    <p>${this.pessoas.length} pessoa(s) no sistema</p>
                </div>

                <div class="pessoas-grid">
                    ${this.pessoas.map(pessoa => `
                        <div class="pessoa-card" data-id="${pessoa.id}">
                            <div class="pessoa-header">
                                <div class="pessoa-avatar">
                                    ${pessoa.nome.charAt(0).toUpperCase()}
                                </div>
                                <div class="pessoa-info">
                                    <h3 class="pessoa-nome">${pessoa.nome}</h3>
                                    <p class="pessoa-email">${pessoa.email}</p>
                                </div>
                                <button class="delete-btn" data-id="${pessoa.id}" 
                                        title="Excluir pessoa">
                                    🗑️
                                </button>
                            </div>
                            
                            <div class="pessoa-details">
                                <div class="detail-item">
                                    <span class="detail-label">Idade:</span>
                                    <span class="detail-value">${pessoa.idade} anos</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Gênero:</span>
                                    <span class="detail-value">${pessoa.genero}</span>
                                </div>
                                ${pessoa.telefone ? `
                                <div class="detail-item">
                                    <span class="detail-label">Telefone:</span>
                                    <span class="detail-value">${pessoa.telefone}</span>
                                </div>
                                ` : ''}
                                ${pessoa.endereco ? `
                                <div class="detail-item">
                                    <span class="detail-label">Endereço:</span>
                                    <span class="detail-value">${pessoa.endereco}</span>
                                </div>
                                ` : ''}
                                ${pessoa.observacoes ? `
                                <div class="detail-item">
                                    <span class="detail-label">Observações:</span>
                                    <span class="detail-value">${pessoa.observacoes}</span>
                                </div>
                                ` : ''}
                            </div>
                            
                            <div class="pessoa-footer">
                                <span class="pessoa-id">ID: ${pessoa.id.slice(0, 8)}</span>
                                <span class="pessoa-date">Cadastrado em: ${new Date(pessoa.dataCadastro).toLocaleDateString('pt-BR')}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="page-actions">
                    <button class="secondary-btn" onclick="appState.navigateTo('form')">
                        <span>➕ Cadastrar Outra Pessoa</span>
                    </button>
                </div>
            </div>
        `;
    }

    renderSobre() {
        return `
            <div class="content-card">
                <div class="about-section">
                    <h2 class="text-gradient">Sobre o NexusFlow</h2>
                    
                    <div class="about-content">
                        <div class="about-text">
                            <p>O <strong>NexusFlow</strong> é uma aplicação SPA moderna desenvolvida para demonstrar conceitos avançados de JavaScript, incluindo:</p>
                            
                            <ul class="feature-list">
                                <li>✅ Gerenciamento de estado da aplicação</li>
                                <li>✅ Armazenamento local (localStorage)</li>
                                <li>✅ Validação de formulários em tempo real</li>
                                <li>✅ Interface responsiva e acessível</li>
                                <li>✅ Navegação SPA sem recarregamento</li>
                                <li>✅ Animações e transições CSS</li>
                            </ul>

                            <div class="tech-stack">
                                <h3>Tecnologias Utilizadas</h3>
                                <div class="tech-grid">
                                    <span class="tech-item">JavaScript ES6+</span>
                                    <span class="tech-item">CSS3 Grid/Flexbox</span>
                                    <span class="tech-item">HTML5 Semântico</span>
                                    <span class="tech-item">LocalStorage API</span>
                                    <span class="tech-item">CSS Variables</span>
                                    <span class="tech-item">Glass Morphism</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ========== LÓGICA DO FORMULÁRIO ==========
    handleFormSubmit(form) {
        const formData = new FormData(form);
        const pessoa = Object.fromEntries(formData.entries());
        
        // Validação
        if (!this.validateForm(pessoa)) {
            return;
        }

        // Adiciona metadados
        pessoa.id = this.generateId();
        pessoa.dataCadastro = new Date().toISOString();

        // Salva no estado
        this.pessoas.push(pessoa);
        this.saveToLocalStorage();

        // Feedback visual
        this.showSuccessMessage('Pessoa cadastrada com sucesso!');
        
        // Limpa o formulário
        form.reset();
        
        // Navega para a lista
        setTimeout(() => this.navigateTo('pessoas'), 1500);
    }

    validateForm(pessoa) {
        let isValid = true;
        
        // Limpa erros anteriores
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        
        // Validações
        if (!pessoa.nome?.trim()) {
            this.showError('nomeError', 'Nome é obrigatório');
            isValid = false;
        }

        if (!pessoa.email?.trim()) {
            this.showError('emailError', 'E-mail é obrigatório');
            isValid = false;
        } else if (!this.isValidEmail(pessoa.email)) {
            this.showError('emailError', 'E-mail inválido');
            isValid = false;
        }

        if (!pessoa.idade || pessoa.idade < 0 || pessoa.idade > 120) {
            this.showError('idadeError', 'Idade deve ser entre 0 e 120 anos');
            isValid = false;
        }

        if (!pessoa.genero) {
            this.showError('generoError', 'Gênero é obrigatório');
            isValid = false;
        }

        return isValid;
    }

    showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    showSuccessMessage(message) {
        // Cria toast de sucesso
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.innerHTML = `
            <span>✅ ${message}</span>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // ========== UTILITÁRIOS ==========
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    saveToLocalStorage() {
        localStorage.setItem('nexusflow-pessoas', JSON.stringify(this.pessoas));
    }

    deletePessoa(id) {
        if (confirm('Tem certeza que deseja excluir esta pessoa?')) {
            this.pessoas = this.pessoas.filter(p => p.id !== id);
            this.saveToLocalStorage();
            this.renderPage(); // Re-renderiza a página atual
            this.showSuccessMessage('Pessoa excluída com sucesso!');
        }
    }

    getMediaIdade() {
        if (this.pessoas.length === 0) return '0';
        const soma = this.pessoas.reduce((acc, pessoa) => acc + parseInt(pessoa.idade), 0);
        return (soma / this.pessoas.length).toFixed(1);
    }

    getTotalGeneros() {
        const generos = new Set(this.pessoas.map(p => p.genero));
        return generos.size;
    }
}

// ========== INICIALIZAÇÃO DA APLICAÇÃO ==========
let appState;

document.addEventListener('DOMContentLoaded', () => {
    appState = new AppState();
});

// Expor para uso global (para os event handlers no HTML)
window.appState = appState;