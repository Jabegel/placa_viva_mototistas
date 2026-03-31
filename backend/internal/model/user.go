package model

type UserProfile struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Type  string `json:"type"` // "Caminhoneiro", "App", "Taxista"
	Token string `json:"token"`
}
