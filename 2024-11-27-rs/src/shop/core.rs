pub enum Kind {
    Aged,
    Sulfuras,
    BackstagePass,
    Default,
}

impl From<&str> for Kind {
    fn from(value: &str) -> Self {
        match value {
            x if x.starts_with("Aged") => Self::Aged,
            x if x.starts_with("Sulfuras") => Self::Sulfuras,
            x if x.starts_with("Backstage passes") => Self::BackstagePass,
            _ => Self::Default,
        }
    }
}
