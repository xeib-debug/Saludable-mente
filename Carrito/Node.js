import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: "TU_ACCESS_TOKEN"
});

app.post("/crear-preferencia", async (req, res) => {
  const result = await mercadopago.preferences.create({
    items: req.body.items
  });
  res.json({ id: result.body.id });
});
