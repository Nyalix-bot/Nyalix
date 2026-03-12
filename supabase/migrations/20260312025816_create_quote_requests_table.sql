-- Create quote_requests table
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Responded', 'Approved')),
  admin_response TEXT,
  admin_responded_at TIMESTAMP WITH TIME ZONE,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_email ON quote_requests(email);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at DESC);

-- Enable RLS
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert
CREATE POLICY "Allow public insert" ON quote_requests
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only authenticated users (admin) can select, update, delete
CREATE POLICY "Allow admin select" ON quote_requests
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin update" ON quote_requests
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin delete" ON quote_requests
  FOR DELETE
  USING (auth.role() = 'authenticated');
