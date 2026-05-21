package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Auth
	auth := r.Group("/auth")
	{
		auth.POST("/send-code", sendCode)
		auth.POST("/verify-code", verifyCode)
	}

	// Postos
	r.GET("/stations", getStations)

	// Cupons e placa
	r.GET("/coupons", getCoupons)
	r.PUT("/user/plate", savePlate)
	r.GET("/user/plate", getPlate)

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	log.Println("Servidor rodando na porta :8080")
	r.Run(":8080")
}
