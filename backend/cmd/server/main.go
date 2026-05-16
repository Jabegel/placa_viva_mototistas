package main

import (
	"backend/internal/api"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.POST("/auth/login", api.Login)
	r.POST("/auth/register", api.Register) 
	r.GET("/dashboard", api.GetDashboard)
	r.GET("/history", api.GetHistory)

	r.Run("0.0.0.0:8080")
}


