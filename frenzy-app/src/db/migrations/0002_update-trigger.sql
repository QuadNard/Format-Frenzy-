-- Custom SQL migration file, put your code below! --
CREATE TRIGGER trigger_update_timestamp
  BEFORE UPDATE ON snippets
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();
