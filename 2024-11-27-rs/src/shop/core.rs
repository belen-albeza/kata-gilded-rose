#[derive(Debug, PartialEq, Clone, Copy)]
pub enum Kind {
    Aged,
    Sulfuras,
    BackstagePass,
    Default,
    Conjured,
}

impl From<&str> for Kind {
    fn from(value: &str) -> Self {
        match value {
            x if x.starts_with("Aged ") => Self::Aged,
            x if x.starts_with("Sulfuras") => Self::Sulfuras,
            x if x.starts_with("Backstage passes ") => Self::BackstagePass,
            x if x.starts_with("Conjured ") => Self::Conjured,
            _ => Self::Default,
        }
    }
}
