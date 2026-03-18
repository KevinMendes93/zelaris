#!/bin/bash

# Instalar nvm
echo "Instalando nvm..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Configurar nvm no shell atual
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Instalar Node 20.19.1
echo "Instalando Node.js 20.19.1..."
nvm install 20.19.1
nvm use 20.19.1
nvm alias default 20.19.1

# Verificar instalação
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Instalar dependências do projeto
echo "Instalando dependências do projeto..."
if [ -f "package.json" ]; then
    npm install
fi

echo "Setup concluído! ✅"
