package main

import (
	"backend/internal/api"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.POST("/auth/login", api.Login)
	r.GET("/dashboard", api.GetDashboard)
	
	// ADICIONE ESTA LINHA AQUI:
	r.GET("/history", api.GetHistory) 

	r.Run("0.0.0.0:8080")
}


