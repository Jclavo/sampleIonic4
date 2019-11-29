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
-- Sistema:		SampleIonic4 - Vers�o 1.0
-- =============================================
ALTER PROCEDURE [dbo].[spCRUDCountry]
-- Parameters for the stored procedure here
	 @StringDataJson   VARCHAR(MAX)
AS
BEGIN

	-->	A -	DECLARA VARIABLES Y CONSTANTES
	--==================================================================================-- 	
	
	-- vari�vel de volta 
	DECLARE @DataJsonResults	NVARCHAR(4000);
	DECLARE @Message			VARCHAR(1000);
	DECLARE @Success			BIT = 0;

	-- vari�vel para autenticar
	DECLARE @RecordCount		INT = 0;

	-- vari�vel JSON
	DECLARE @CodigoUsuarioSistema	BIGINT;
	DECLARE @StatusCRUD				VARCHAR(50);
	DECLARE @HashKey			    VARCHAR(MAX);

		-->	B -	LOGICA

	BEGIN TRY --> Control de ejecuci�n

		--> Limpar '/' do JSON, 
		SET @StringDataJson =   REPLACE(@StringDataJson,'\','');  

		--> Pegar JSON dados
		SET @CodigoUsuarioSistema	= JSON_VALUE(@StringDataJson, '$.CodigoUsuarioSistema');
		SET @StatusCRUD				= JSON_VALUE(@StringDataJson, '$.StatusCRUD');
		SET @HashKey				= JSON_VALUE(@StringDataJson, '$.Hashkey')	


		--> Validar usu�rio 
		SET @CodigoUsuarioSistema = ( SELECT USUARIOS.CodigoUsuario			    
		FROM tblUsuarioSistema USUARIOS WITH (NOLOCK)
		WHERE USUARIOS.CodigoUsuario = @CodigoUsuarioSistema );

		IF (ISNULL(@CodigoUsuarioSistema,0) > 0)
				
			--> Validar usu�rio session
			BEGIN

				SET @Message = 'Loading...';
				SET @Success = 1;
			
				--> Validar usu�rio session
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
				ELSE --> ELSE Validar usu�rio session
				
					BEGIN
						SET @Message = 'Sua Sess�o Expirou!!!';
						SET @Success = 0;		
						SET @DataJsonResults = '';
					END
				
				IF (ISNULL(@DataJsonResults,0) = '0') 
					SET @DataJsonResults = '';
					
				SELECT [message] = @Message, [success] = @Success, [DataJsonResults] = @DataJsonResults;
			END
		
		ELSE --> ELSE Validar usu�rio

			BEGIN
				SET @Message = 'Usu�rio n�o dispon�vel. Verifiquei por favor!!!';
				SET @Success = 0
				SELECT  [message] = @Message, [success] = @Success , [DataJsonResults] = '';
			END
		
		
	END TRY
	
	--	Z -	CONTROLE DE EXCESS�O
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



