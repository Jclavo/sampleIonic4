-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:  	JCLAVO
-- Create date: 28/Novembro/2019
-- Modify date: 28/Novembro/2019
-- Description:	Store de Procedure para CRUD Country
-- Sistema:		SampleIonic4 - Versão 1.0
-- =============================================
ALTER PROCEDURE [dbo].[spCRUDCountry]
-- Parameters for the stored procedure here
	 @StringDataJson   VARCHAR(MAX)
AS
BEGIN

	-->	A -	DECLARA VARIABLES Y CONSTANTES
	--==================================================================================-- 	
	
	-- variável de volta 
	DECLARE @DataJsonResults	NVARCHAR(4000);
	DECLARE @Message			VARCHAR(1000);
	DECLARE @Success			BIT = 0;

	-- variável para autenticar
	DECLARE @RecordCount		INT = 0;

	-- variável JSON
	DECLARE @CodigoUsuarioSistema	BIGINT;
	DECLARE @StatusCRUD				VARCHAR(50);
	DECLARE @HashKey			    VARCHAR(MAX);

		-->	B -	LOGICA

	BEGIN TRY --> Control de ejecución

		--> Limpar '/' do JSON, 
		SET @StringDataJson =   REPLACE(@StringDataJson,'\','');  

		--> Pegar JSON dados
		SET @CodigoUsuarioSistema	= JSON_VALUE(@StringDataJson, '$.CodigoUsuarioSistema');
		SET @StatusCRUD				= JSON_VALUE(@StringDataJson, '$.StatusCRUD');
		SET @HashKey				= JSON_VALUE(@StringDataJson, '$.Hashkey')	


		--> Validar usuário 
		SET @CodigoUsuarioSistema = ( SELECT USUARIOS.CodigoUsuario			    
		FROM tblUsuarioSistema USUARIOS WITH (NOLOCK)
		WHERE USUARIOS.CodigoUsuario = @CodigoUsuarioSistema );

		IF (ISNULL(@CodigoUsuarioSistema,0) > 0)
				
			--> Validar usuário session
			BEGIN

				SET @Message = 'Loading...';
				SET @Success = 1;
			
				--> Validar usuário session
				SET @RecordCount = ( SELECT COUNT(USUARIOSESSION.CodigoUsuario)
				FROM tblUsuarioSession USUARIOSESSION WITH (NOLOCK)
				WHERE 
				USUARIOSESSION.CodigoUsuario = @CodigoUsuarioSistema
				AND USUARIOSESSION.DataTimeExpiration IS NULL);
				--AND USUARIOSESSION.DataTimeExpiration IS NULL
				--AND USUARIOSESSION.HashKey = TRIM(@HashKey));
			
				IF (@RecordCount > 0) 

					
					BEGIN
						IF @StatusCRUD = 'Pesquisar'
						BEGIN
							
						
							SET @DataJsonResults = 
								( SELECT * FROM tblCountry AS Country WITH (NOLOCK) 
									FOR JSON PATH );

							SET @Message = 'Crountries gotten';
							SET @Success = 1;

						END
							
					END
				ELSE --> ELSE Validar usuário session
				
					BEGIN
						SET @Message = 'Sua Sessão Expirou!!!';
						SET @Success = 0;		
						SET @DataJsonResults = '';
					END
				
				IF (ISNULL(@DataJsonResults,0) = '0') 
					SET @DataJsonResults = '';
					
				SELECT [message] = @Message, [success] = @Success, [DataJsonResults] = @DataJsonResults;
			END
		
		ELSE --> ELSE Validar usuário

			BEGIN
				SET @Message = 'Usuário não disponível. Verifiquei por favor!!!';
				SET @Success = 0
				SELECT  [message] = @Message, [success] = @Success , [DataJsonResults] = '';
			END
		
		
	END TRY
	
	--	Z -	CONTROLE DE EXCESSÃO
	--==================================================================================--
	BEGIN CATCH
		
			IF (@@TRANCOUNT > 0) 
			BEGIN
				ROLLBACK TRANSACTION;
			END;

			SELECT [message] = CONCAT (ERROR_MESSAGE(),'Paramentros Recebido:',@StringDataJson), success = 0, [DataJsonResults] = ''			   
		
			RETURN 1;

	END CATCH

	RETURN 0;

END



