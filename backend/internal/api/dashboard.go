package api

import (
	"net/http"
	"github.com/gin-gonic/gin"
 )

type DashboardData struct {
	UserName           string  `json:"user_name"`
	UserType           string  `json:"user_type"`
	MonthlySavings     float64 `json:"monthly_savings"`
	TotalLitersMonth   float64 `json:"total_liters_month"`
	NextRewardProgress float64 `json:"next_reward_progress"` // 0.0 a 1.0
	NextRewardText     string  `json:"next_reward_text"`
}

func GetDashboard(c *gin.Context) {
	// MOCK: Dados simulados para o motorista profissional
	data := DashboardData{
		UserName:           "João Motorista",
		UserType:           "Caminhoneiro",
		MonthlySavings:     185.50,
		TotalLitersMonth:   650.0,
		NextRewardProgress: 0.75,
		NextRewardText:     "Faltam 50L para sua Ducha Grátis!",
	}

	c.JSON(http.StatusOK, data )
}