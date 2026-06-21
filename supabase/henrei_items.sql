-- 返礼品ナビ用テーブル（Supabase SQL Editor で実行）
CREATE TABLE IF NOT EXISTS henrei_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  donation_amount INTEGER NOT NULL,
  market_price INTEGER NOT NULL,
  return_rate NUMERIC(5,1) NOT NULL,
  category_slug TEXT NOT NULL,
  prefecture_slug TEXT NOT NULL,
  municipality_name TEXT NOT NULL,
  rakuten_item_url TEXT NOT NULL,
  review_average NUMERIC(2,1),
  review_count INTEGER DEFAULT 0,
  popularity_score INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_henrei_category ON henrei_items(category_slug);
CREATE INDEX IF NOT EXISTS idx_henrei_prefecture ON henrei_items(prefecture_slug);
CREATE INDEX IF NOT EXISTS idx_henrei_donation ON henrei_items(donation_amount);
CREATE INDEX IF NOT EXISTS idx_henrei_return_rate ON henrei_items(return_rate DESC);

-- 公開読み取り（anon key）
ALTER TABLE henrei_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "henrei_items_public_read" ON henrei_items
  FOR SELECT USING (true);
