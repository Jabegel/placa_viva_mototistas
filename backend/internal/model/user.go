package model

// Estrutura para o Veículo
type Vehicle struct {
	Name     string `json:"name"`
	Plate    string `json:"plate"`
	FuelType string `json:"fuel_type"`
}

// Estrutura para o Perfil do Usuário
type UserProfile struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Phone     string    `json:"phone"`
	Email     string    `json:"email"`
	BirthDate string    `json:"birth_date"`
	Gender    string    `json:"gender"`
	Vehicles  []Vehicle `json:"vehicles"`
	Token     string    `json:"token"`
}

// Estrutura para o Histórico de Abastecimento
type Fueling struct {
	ID          int     `json:"id"`
	Date        string  `json:"date"`
	StationName string  `json:"station_name"`
	FuelType    string  `json:"fuel_type"`
	Liters      float64 `json:"liters"`
	AmountPaid  float64 `json:"amount_paid"`
	Savings     float64 `json:"savings"`
}
