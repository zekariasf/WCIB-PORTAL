function Card({ children, title }) {
  return (
    <div className="card">
      {title && <h3 className="card__title">{title}</h3>}
      <div className="card__body">{children}</div>
    </div>
  )
}

export default Card
