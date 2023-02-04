use clap::Parser;

#[derive(Parser, Debug)]
struct Args {
    #[arg(short, long, default_value_t = 1)]
    days: u8,
}

fn main() {
    let args = Args::parse();
    gildedrose_kata::run(args.days as u8);
}
