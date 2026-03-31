package main

import (
	"backend/internal/api"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Rota de Login
	r.POST("/auth/login", api.Login)

	// Rodar na porta 8080 em todas as interfaces de rede
	r.Run("0.0.0.0:8080")
}
