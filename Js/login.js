document.addEventListener("DOMContentLoaded", () => {
    const urlBase = "https://umfgcloud-autenticacao-service-7e27ead80532.herokuapp.com";

    const formCadastro = document.getElementById("form-cadastro");
    formCadastro.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("cadastro-email").value;
        const senha = document.getElementById("cadastro-senha").value;
        const confirmar = document.getElementById("cadastro-confirmar").value;
        const msg = document.getElementById("mensagem-cadastro");

        msg.textContent = "";
        msg.style.color = "";

        // Validação da senha
        const senhaValida = validarSenha(senha, msg);
        if (!senhaValida) {
            return;
        }

        if (senha !== confirmar) {
            msg.textContent = "As senhas não coincidem!";
            msg.style.color = "red";
            return;
        }

        try {
            const response = await fetch(`${urlBase}/Autenticacao/registar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    Email: email, 
                    Senha: senha, 
                    SenhaConfirmada: confirmar 
                }),
            });

            if (response.status === 200) {
                msg.textContent = "Cadastro realizado com sucesso!";
                msg.style.color = "green";
                
                setTimeout(() => {
                    document.getElementById("signIn").click();
                    formCadastro.reset();
                }, 2000);
            } else {
                const errorData = await response.json().catch(() => ({}));
                msg.textContent = errorData.message || "Erro no cadastro. Status: " + response.status;
                msg.style.color = "red";
            }
        } catch (error) {
            console.error("Erro no cadastro:", error);
            msg.textContent = "Erro na conexão com o servidor: " + error.message;
            msg.style.color = "red";
        }
    });

    // Função para validar a senha
    function validarSenha(senha, elementoMensagem) {
        let mensagens = [];
        
        // Verifica se tem pelo menos 8 caracteres
        if (senha.length < 8) {
            mensagens.push("A senha deve ter pelo menos 8 caracteres");
        }
        
        // Verifica se tem pelo menos uma letra maiúscula
        if (!/[A-Z]/.test(senha)) {
            mensagens.push("A senha deve conter pelo menos uma letra maiúscula");
        }
        
        // Verifica se tem pelo menos um caractere especial
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
            mensagens.push("A senha deve conter pelo menos um caractere especial");
        }
        
        // Verifica se tem pelo menos um número
        if (!/[0-9]/.test(senha)) {
            mensagens.push("A senha deve conter pelo menos um número");
        }
        
        if (mensagens.length > 0) {
            elementoMensagem.innerHTML = mensagens.join("<br>");
            elementoMensagem.style.color = "red";
            return false;
        }
        
        return true;
    }

    // Restante do seu código (login e transições) permanece o mesmo
    const formLogin = document.getElementById("form-login");
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("login-email").value;
        const senha = document.getElementById("login-senha").value;
        const msg = document.getElementById("mensagem-login");

        msg.textContent = "";

        try {
            const response = await fetch(`${urlBase}/Autenticacao/autenticar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                
                body: JSON.stringify({ 
                    email: email,  
                    senha: senha   
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro na autenticação");
            }

            const data = await response.json();

            localStorage.setItem("email", data.email);
            localStorage.setItem("token", data.token);
            localStorage.setItem("expiraEm", data.expiraEm);

            window.location.href = "welcome.html";
        } catch (error) {
            console.error("Erro no login:", error);
            msg.textContent = error.message || "Erro na conexão com o servidor.";
        }
    });

    const signInButton = document.getElementById("signIn");
    const signUpButton = document.getElementById("signUp");
    const body = document.querySelector("body");

    signInButton.addEventListener("click", () => {
        body.classList.add("sign-in");
        body.classList.remove("sign-up");
    });

    signUpButton.addEventListener("click", () => {
        body.classList.add("sign-up");
        body.classList.remove("sign-in");
    });

    body.classList.add("on-load");
});